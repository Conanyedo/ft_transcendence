import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { deleteAvatar, deleteOldAvatar, isFileValid, resizeAvatar } from 'src/config/upload.config';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { conversationDto, createChannelDto, createConvDto, createMemberDto, createMsgDto, msgDto, updateChannelDto } from './chat.dto';
import { Conversation, convType, invStatus, Member, memberStatus, Message } from './chat.entity';
import { ChatGateway } from './chat.gateway';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { FriendshipService } from 'src/friendship/friendship.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { exit } from 'process';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Conversation)
		private conversationRepository: Repository<Conversation>,
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		@InjectRepository(Member)
		private memberRepository: Repository<Member>,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		@Inject(forwardRef(() => FriendshipService))
		private friendshipService: FriendshipService,
		@Inject(forwardRef(() => ChatGateway))
		private chatGateway: ChatGateway,
		private schedulerRegistry: SchedulerRegistry,
		private readonly configService: ConfigService
	) { }

	async searchChannels(login: string, search: string) {
		search = search.toLowerCase();
		const convs: Conversation[] = await this.conversationRepository
			.createQueryBuilder('conversations')
			.select(['conversations.id', 'conversations.name', 'conversations.avatar', 'conversations.type'])
			.where(`(conversations.type = 'Public' OR conversations.type = 'Protected') AND LOWER(conversations.name) LIKE '%${search}%'`)
			.getMany()
		if (!convs.length)
			return { data: convs };
		const convsList = [];
		await Promise.all(convs.map(async (conv) => {
			const exist = await this.memberRepository
				.query(`select members.id, members."status" from members Join users ON members."userId" = users.id where members."conversationId" = '${conv.id}' AND users."login" = '${login}';`);
			if (!exist.length || exist[0].status === memberStatus.LEFT)
				convsList.push({ convId: conv.id, Avatar: conv.avatar, title: conv.name, type: conv.type, status: undefined });
			else if (exist[0].status !== memberStatus.BANNED)
				convsList.push({ convId: conv.id, Avatar: conv.avatar, title: conv.name, type: conv.type, status: exist[0].status });
		}))
		return { data: [...convsList] };
	}

	async getAllUnreads(login: string) {
		const members: Member[] = await this.memberRepository
			.query(`select members.id, members."unread" from members Join users ON members."userId" = users.id where users."login" = '${login}' AND members."leftDate" is null;`);
		if (!members.length) return { data: false };
		const member: Member = members.find((member) => (member.unread > 0))
		if (!member)
			return { data: false };
		return { data: true }
	}

	async setMsgsAsRead(login: string, convId: string) {
		const member = await this.memberRepository
			.query(`select members.id, members."unread" from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND members."leftDate" is null;`);
		if (!member.length) return { err: 'Invalid conversation' };
		await this.memberRepository
			.query(`update members set unread = '${0}' where members."id" = '${member[0].id}';`);
		return { data: true };
	}

	async updateUnreadMsgs(login: string, convId: string) {
		const members = await this.memberRepository
			.query(`select members.id, members."unread", users.login from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND members."leftDate" is null;`);
		if (!members.length) return;
		await Promise.all(members.map(async (member) => {
			const unread: number = +member.unread;
			if (login !== member.login)
				await this.memberRepository
					.query(`update members set unread = '${unread + 1}' where members."id" = '${member.id}';`);
		}))
	}

	async getRoomSockets(login: string, room: string) {
		const sockets = await this.chatGateway.server.in(room).fetchSockets();
		const newSockets: string[] = [];
		await Promise.all(sockets.map(async (socket) => {
			const relation = await this.friendshipService.getRelation(login, socket.data.login);
			if (relation !== 'blocked')
				newSockets.push(socket.id);
		}))
		return newSockets;
	}

	async joinConversations(client: Socket) {
		const convs: conversationDto[] = await this.memberRepository
			.query(`select conversations.id as "convId" from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where users."login" = '${client.data.login}' AND members."leftDate" IS null;`);
		if (!convs.length)
			return;
		convs.forEach((conv) => (client.join(conv.convId)));
	}

	async getUserInfo(login: string, name: string) {
		const userInfo = await this.userService.getFriend(name);
		if (!userInfo)
			return { err: 'User not found' };
		const conv = await this.memberRepository
			.query(`select conversations.id, count(*) from members join users on members."userId" = users.id join conversations on members."conversationId" = conversations.id where (users.login = '${login}' or users.login = '${name}') and conversations.type = 'Dm' group by conversations.id having count(*) = 2;`);
		if (conv.length)
			return { data: true };
		const relation = await this.friendshipService.getRelation(login, name);
		if (relation === 'blocked')
			return { err: 'User not found' };
		return { data: { ...userInfo, relation } };
	}

	async getChannelInfo(login: string, id: string) {
		const conv = await this.conversationRepository
			.query(`select conversations.id as "convId", conversations.type, conversations.avatar, conversations.name from conversations where conversations.type != 'Dm' AND conversations.id = '${id}';`);
		if (!conv.length)
			return { err: 'Channel not found' };
		const member = await this.memberRepository
			.query(`select members.id from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where users."login" = '${login}' AND conversations.id = '${id}';`);
		if (member.length)
			return { data: true };
		if (conv[0].type === 'Private')
			return { err: 'Channel not found' };
		return { data: { ...conv[0] } };
	}

	async blockUser(login: string, user: string) {
		const conv = await this.memberRepository
			.query(`select conversations.id, count(*) from members join users on members."userId" = users.id join conversations on members."conversationId" = conversations.id where (users.login = '${login}' or users.login = '${user}') and conversations.type = 'Dm' group by conversations.id having count(*) = 2;`);
		if (!conv.length)
			return null;
		const currDate = new Date(Date.now()).toISOString();
		await this.memberRepository
			.query(`update members set status = 'Blocker', "leftDate" = '${currDate}' FROM users where members."userId" = users.id AND members."conversationId" = '${conv[0].id}' AND users."login" = '${login}';`);
		const sockets = await this.chatGateway.server.fetchSockets();
		const clients = sockets.filter((socket) => (socket.data.login === login));
		clients.forEach((client) => (client.leave(conv[0].id)))
	}

	async unBlockUser(login: string, user: string) {
		const conv = await this.memberRepository
			.query(`select conversations.id, count(*) from members join users on members."userId" = users.id join conversations on members."conversationId" = conversations.id where (users.login = '${login}' or users.login = '${user}') and conversations.type = 'Dm' group by conversations.id having count(*) = 2;`);
		if (!conv.length)
			return null;
		await this.memberRepository
			.query(`update members set status = 'Member', "leftDate" = null FROM users where members."userId" = users.id AND members."conversationId" = '${conv[0].id}' AND users."login" = '${login}';`);
		const sockets = await this.chatGateway.server.fetchSockets();
		const clients = sockets.filter((socket) => (socket.data.login === login));
		clients.forEach((client) => (client.join(conv[0].id)))
	}

	async encryptPassword(password: string) {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(password, salt);
	}

	async checkPassword(password: string, input: string) {
		return await bcrypt.compare(input, password);
	}

	async getConvInfo(login: string, conv: conversationDto) {
		if (conv.leftDate && conv.leftDate < conv.lastUpdate)
			conv.lastUpdate = conv.leftDate;
		const { leftDate, ...convInfo }: conversationDto = { ...conv }
		if (conv.type === 'Dm') {
			const users = await this.memberRepository
				.query(`select users.login, users.fullname, users.status, users.avatar, members."unread" from members Join users ON members."userId" = users.id where members."conversationId" = '${conv.convId}' AND users.login != '${login}';`);
			const relation = await this.friendshipService.getChatRelation(login, users[0].login);
			convInfo.name = users[0].fullname;
			convInfo.login = users[0].login;
			convInfo.status = (relation === 'blocked') ? 'Blocker' : users[0].status;
			convInfo.avatar = users[0].avatar;
		}
		else {
			const membersNum = await this.memberRepository
				.query(`select COUNT(*) from members where members."conversationId" = '${convInfo.convId}' AND members."leftDate" is null;`);
			convInfo.login = convInfo.name;
			convInfo.membersNum = +membersNum[0].count;
		}
		return convInfo;
	}

	async getConversation(login: string, convId: string) {
		const convs: conversationDto[] = await this.memberRepository
			.query(`select conversations.id as "convId", conversations.type, conversations.avatar, conversations.name, conversations."lastUpdate", members.status, members."leftDate", members."unread" from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where users."login" = '${login}' AND members."conversationId" = '${convId}';`);
		if (!convs.length) return { err: 'Conversation not found!' };
		const conversation: conversationDto = await this.getConvInfo(login, convs[0]);
		return { data: { ...conversation } };
	}

	async getConversations(login: string) {
		const convs: conversationDto[] = await this.memberRepository
			.query(`select conversations.id as "convId", conversations.type, conversations.avatar, conversations.name, conversations."lastUpdate", members.status, members."leftDate", members."unread" from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where users."login" = '${login}' order by conversations."lastUpdate" DESC;`);
		const conversations: conversationDto[] = await Promise.all(convs.map(async (conv) => (this.getConvInfo(login, conv))));
		conversations.sort((a: conversationDto, b: conversationDto) => {
			const right: number = a.lastUpdate.getTime();
			const left: number = b.lastUpdate.getTime();
			return left - right;
		});
		return { data: [...conversations] };
	}

	async createConv(newConv: createConvDto, members: createMemberDto[]) {
		let conv: Conversation = new Conversation();
		conv.type = newConv.type;
		if (newConv.name)
			conv.name = newConv.name;
		if (newConv.avatar)
			conv.avatar = newConv.avatar;
		if (newConv.password)
			conv.password = await this.encryptPassword(newConv.password);
		conv = await this.conversationRepository.save(conv);

		await Promise.all(members.map(async (mem) => {
			const member: Member = new Member();
			member.status = mem.status;
			member.conversation = conv;
			member.user = await this.userService.getUser(mem.login);
			await this.memberRepository.save(member);
		}));
		return conv;
	}

	async updateConvDate(convId: string, date: Date) {
		return await this.conversationRepository
			.createQueryBuilder('conversations')
			.update({ lastUpdate: date })
			.where('id = :convId', { convId: convId })
			.execute();
	}

	async getConvById(convId: string) {
		const conv: Conversation = await this.conversationRepository
			.createQueryBuilder('conversations')
			.where('conversations.id = :convId', { convId: convId })
			.getOne();
		return conv;
	}

	async storeMsg(msg: string, sender: string, invitation: string, convId: Conversation) {
		let msgs: Message = new Message();
		msgs.msg = msg;
		msgs.sender = sender;
		msgs.invitation = invitation;
		msgs.conversation = convId;
		msgs = await this.messageRepository.save(msgs);
		return msgs;
	}

	async getMessages(login: string, id: string, convId: string) {
		const dates = await this.memberRepository
			.query(`select members."joinDate", members."leftDate" from members where members."conversationId" = '${convId}' AND members."userId" = '${id}';`);
		if (!dates.length)
			return { err: 'Invalid data' };
		const joinDate: string = new Date((dates[0].joinDate - new Date().getTimezoneOffset() * 60000)).toISOString();
		const leftDate: string = (!dates[0].leftDate) ? dates[0].leftDate : new Date((dates[0].leftDate - new Date().getTimezoneOffset() * 60000)).toISOString();
		let msgs: Message[] = [];
		if (leftDate)
			msgs = await this.messageRepository
				.query(`SELECT messages."id", messages."sender", messages."msg", messages."createDate", messages."conversationId" as "convId", messages."invitation", messages."status" FROM messages where messages."conversationId" = '${convId}' AND messages."createDate" >= '${joinDate}' AND messages."createDate" <= '${leftDate}' order by messages."createDate" ASC;`);
		else
			msgs = await this.messageRepository
				.query(`SELECT messages."id", messages."sender", messages."msg", messages."createDate", messages."conversationId" as "convId", messages."invitation", messages."status" FROM messages where messages."conversationId" = '${convId}' AND messages."createDate" >= '${joinDate}' order by messages."createDate" ASC;`);

		if (!msgs.length)
			return { data: msgs };
		const conv: Conversation = await this.getConvById(convId);
		const newMsgs: msgDto[] = [];
		await Promise.all(msgs.map(async (msg) => {
			const newDate: Date = new Date(msg.createDate.getTime() - new Date().getTimezoneOffset() * 120000);
			const msgSent: msgDto = { msg: msg.msg, sender: msg.sender, invitation: msg.invitation, status: msg.status, date: newDate, convId: conv.id, msgId: msg.id }
			if (conv.type === convType.Dm)
				newMsgs.push(msgSent);
			else {
				const relation = await this.friendshipService.getRelation(login, msg.sender);
				if (relation !== 'blocked') {
					const fullname = await this.memberRepository
						.query(`select users.fullname from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${msg.sender}';`);
					msgSent.fullname = fullname[0].fullname;
					newMsgs.push(msgSent);
				}
			}
		}))
		newMsgs.sort((a: msgDto, b: msgDto) => {
			const right: number = a.date.getTime();
			const left: number = b.date.getTime();
			return right - left;
		});
		return { data: [...newMsgs] };
	}

	async updateInvitation(login: string, convId: string, msgId: string, status: invStatus) {
		const exist = await this.memberRepository
			.query(`select from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users.login != '${login}';`);
		if (!exist.length)
			return { err: 'Invalid data' };
		await this.messageRepository
			.createQueryBuilder('messages')
			.update({ status: status })
			.where(`id = '${msgId}' AND status = '${invStatus.SENT}'`)
			.execute();
		const msg = await this.messageRepository
			.query(`SELECT messages."id" as "msgId", messages."sender", messages."msg", messages."createDate", messages."conversationId" as "convId", messages."invitation", messages."status" FROM messages where messages."id" = '${msgId}';`);
		return { data: msg[0] };
	}

	async createNewDm(client: Socket, data: createMsgDto) {
		const exist = await this.memberRepository
			.query(`select conversations.id, count(*) from members join users on members."userId" = users.id join conversations on members."conversationId" = conversations.id where (users.login = '${client.data.login}' or users.login = '${data.receiver}') and conversations.type = 'Dm' group by conversations.id having count(*) = 2;`);
		if (exist.length) {
			data.convId = exist[0].id;
			return await this.createNewMessage(client.data.login, data);
		}
		const newConv: createConvDto = { type: convType.Dm };
		const newMembers: createMemberDto[] = [
			{ status: memberStatus.MEMBER, login: client.data.login },
			{ status: memberStatus.MEMBER, login: data.receiver }
		];
		const conv: Conversation = await this.createConv(newConv, newMembers);
		const newMsg: Message = await this.storeMsg(data.msg, client.data.login, data.invitation, conv);
		const sockets = await this.chatGateway.server.fetchSockets();
		const clients = sockets.filter((socket) => (socket.data.login === client.data.login));
		clients.forEach((client) => (client.join(conv.id)));
		const friendSockets = sockets.filter((socket) => (socket.data.login === data.receiver))
		friendSockets.forEach((friendSocket) => (friendSocket.join(conv.id)));
		const fullname = await this.memberRepository
			.query(`select users."fullname" from members Join users ON members."userId" = users.id where users.login != '${client.data.login}';`);
		const newDate: Date = new Date(newMsg.createDate.getTime() - new Date().getTimezoneOffset() * 120000);
		const msg: msgDto = { msg: data.msg, sender: client.data.login, fullname: fullname[0].fullname, invitation: newMsg.invitation, status: newMsg.status, date: newDate, convId: conv.id, msgId: newMsg.id };
		return msg;
	}

	async createNewMessage(login: string, data: createMsgDto) {
		if (!data.convId)
			return null;
		const conv = await this.getConvById(data.convId);
		const exist = await this.memberRepository
			.query(`select members.status from members Join users ON members."userId" = users.id where members."conversationId" = '${data.convId}' AND users."login" = '${login}';`);
		if (!exist.length)
			return null;
		const status = exist[0].status;
		if (status === 'Muted' || status === 'Left' || status === 'Banned' || status === 'Blocker')
			return status;
		const newMsg: Message = await this.storeMsg(data.msg, login, data.invitation, conv);
		await this.updateConvDate(conv.id, newMsg.createDate);
		const fullname = await this.memberRepository
			.query(`select users."fullname" from members Join users ON members."userId" = users.id where users.login = '${login}';`);
		const newDate: Date = new Date(newMsg.createDate.getTime() - new Date().getTimezoneOffset() * 120000);
		const msg: msgDto = { msg: data.msg, sender: login, fullname: fullname[0].fullname, invitation: newMsg.invitation, status: newMsg.status, date: newDate, convId: conv.id, msgId: newMsg.id };
		return msg;
	}

	async createChannel(owner: string, data: createChannelDto) {
		if (data.type === convType.PROTECTED && !data.password?.length)
			return { err: 'Please provide password' };
		if (data.type !== convType.PROTECTED) data.password = undefined;
		const avatar: string = `https://ui-avatars.com/api/?name=${data.name}&size=220&background=2C2C2E&color=409CFF&length=1`;
		const newConv: createConvDto = { type: data.type, name: data.name, avatar: avatar, password: data.password };
		data.members.unshift(owner);
		data.members = [...new Set(data.members)];
		const newMembers: createMemberDto[] = data.members.map((mem) => {
			if (mem === owner)
				return { status: memberStatus.OWNER, login: owner };
			return { status: memberStatus.MEMBER, login: mem };
		});
		const conv: Conversation = await this.createConv(newConv, newMembers);
		const sockets = await this.chatGateway.server.fetchSockets();
		data.members.forEach((member) => {
			const membersSockets = sockets.filter((socket) => (socket.data.login === member));
			membersSockets.forEach((memberSocket) => (memberSocket.join(conv.id)));
		});
		return { data: { convId: conv.id, name: conv.name, login: conv.name, type: conv.type, membersNum: data.members.length, avatar: conv.avatar } };
	}

	async joinChannel(login: string, convId: string, password: string, owner: boolean) {
		const exist = await this.conversationRepository
			.query(`select id, type, password from conversations where conversations.id = '${convId}';`);
		if (!exist.length)
			return { err: 'Invalid data' };
		if (exist[0].type === 'Protected' && !owner) {
			if (!password) return { err: 'Please provide a correct password' };
			const match: boolean = await this.checkPassword(exist[0].password, password);
			if (!match) return { err: 'Invalid password' };
		}
		const memberExist = await this.memberRepository
			.query(`select members.id, members."leftDate", members."status" from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}';`);
		const ownerExist = await this.memberRepository
			.query(`select members.id from members where members."conversationId" = '${convId}' AND members.status = 'Owner';`);
		let status: memberStatus = memberStatus.MEMBER;
		if (!ownerExist.length)
			status = memberStatus.OWNER;
		if (!memberExist.length) {
			const member = new Member();
			member.status = status;
			member.conversation = await this.getConvById(convId);;
			member.user = await this.userService.getUser(login);
			await this.memberRepository.save(member);
		}
		else if ((memberExist[0].leftDate && owner) || (memberExist[0].leftDate && memberExist[0].status !== memberStatus.BANNED)) {
			await this.memberRepository
				.query(`update members set "leftDate" = null, "status" = '${status}' FROM users where members."userId" = users.id AND members."conversationId" = '${convId}' AND users."login" = '${login}';`);
		}
		const sockets = await this.chatGateway.server.fetchSockets();
		const clients = sockets.filter((socket) => (socket.data.login === login));
		clients.forEach((client) => (client.join(convId)));
		return { data: { convId } };
	}

	async leaveChannel(login: string, convId: string) {
		const exist = await this.memberRepository
			.query(`select members.status, members.id from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND conversations."type" != 'Dm' AND members."leftDate" is null;`);
		if (!exist.length)
			return { err: 'Invalid data' };
		if (exist[0].status === 'Owner') {
			const admins = await this.memberRepository
				.query(`select members.id from members where members."conversationId" = '${convId}' AND members.status = 'Admin';`);
			if (admins.length) {
				await this.memberRepository
					.query(`update members set "status" = 'Owner' where members.id = '${admins[0].id}';`);
			} else {
				const members = await this.memberRepository
					.query(`select members.id from members where members."conversationId" = '${convId}' AND members.status = 'Member';`);
				if (members.length) {
					await this.memberRepository
						.query(`update members set "status" = 'Owner' where members.id = '${members[0].id}';`);
				} else {
					const muted = await this.memberRepository
						.query(`select members.id from members where members."conversationId" = '${convId}' AND members.status = 'Muted';`);
					if (muted.length) {
						await this.memberRepository
							.query(`update members set "status" = 'Owner' where members.id = '${muted[0].id}';`);
					}
				}
			}
		}
		const currDate = new Date().toISOString();
		await this.memberRepository
			.query(`update members set "leftDate" = '${currDate}', "status" = 'Left' where members.id = '${exist[0].id}';`);
		const sockets = await this.chatGateway.server.fetchSockets();
		const clients = sockets.filter((socket) => (socket.data.login === login));
		clients.forEach((client) => (client.leave(convId)));
		return { data: { convId } };
	}

	async channelProfile(login: string, convId: string) {
		const exist = await this.memberRepository
			.query(`select members.status from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}';`);
		if (!exist.length)
			return { err: 'Invalid data' };
		const owner: Member[] = await this.memberRepository
			.query(`select users."login", users."fullname", users."avatar", members."status" from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND members."status" = 'Owner';`);
		const admins: Member[] = await this.memberRepository
			.query(`select users."login", users."fullname", users."avatar", members."status" from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND members."status" = 'Admin';`);
		const members: Member[] = await this.memberRepository
			.query(`select users."login", users."fullname", users."avatar", members."status" from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND members."status" = 'Member';`);
		let muted: Member[] = [];
		if (exist[0].status === 'Owner' || exist[0].status === 'Admin')
			muted = await this.memberRepository
				.query(`select users."login", users."fullname", users."avatar", members."status" from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND members."status" = 'Muted';`);
		return { data: { owner, admins, members, muted } };
	}

	async setMemberStatus(login: string, convId: string, member: string, status: memberStatus) {
		const exist = await this.memberRepository
			.query(`select from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND (members."status" = 'Owner' OR members."status" = 'Admin');`);
		if (!exist.length)
			return { err: 'Invalid data' };
		await this.memberRepository
			.query(`update members set status = '${status}' FROM users where members."userId" = users.id AND members."conversationId" = '${convId}' AND users."login" = '${member}' AND members."leftDate" IS NULL AND members."status" != 'Owner';`);
		return { data: true };
	}

	async addMembers(login: string, convId: string, members: string[]) {
		const exist = await this.memberRepository
			.query(`select from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND (members."status" = 'Owner' OR members."status" = 'Admin');`);
		if (!exist.length)
			return { err: 'Invalid data' };
		members = [...new Set(members)];
		members.forEach(async (mem) => {
			await this.joinChannel(mem, convId, undefined, true);
		})
		return { data: true };
	}

	async banMember(login: string, convId: string, member: string) {
		const exist = await this.memberRepository
			.query(`select from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND (members."status" = 'Owner' OR members."status" = 'Admin');`);
		if (!exist.length)
			return { err: 'Invalid data' };
		const currDate = new Date(Date.now()).toISOString();
		await this.memberRepository
			.query(`update members set "leftDate" = '${currDate}', "status" = 'Banned' FROM users where members."userId" = users.id AND members."conversationId" = '${convId}' AND members."status" != 'Owner' AND users."login" = '${member}';`);
		const sockets = await this.chatGateway.server.fetchSockets();
		const clients = sockets.filter((socket) => (socket.data.login === member));
		clients.forEach((client) => (client.leave(convId)));
		return { data: true };
	}

	async unmuteMember(login: string, convId: string, member: string) {
		const exist = await this.memberRepository
			.query(`select from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND (members."status" = 'Owner' OR members."status" = 'Admin');`);
		if (!exist.length)
			return { err: 'Invalid data' };
		const memberId = await this.memberRepository
			.query(`select members.id from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${member}' AND members."status" = 'Muted';`);
		if (!memberId.length)
			return { err: 'Invalid data' };
		await this.memberRepository
			.query(`update members set "leftDate" = null, "status" = 'Member' where members."id" = '${memberId[0].id}';`);
		const name: string = memberId[0].id;
		if (this.schedulerRegistry.doesExist("cron", name))
			this.schedulerRegistry.deleteCronJob(name);
		return { data: true };
	}

	async muteMember(login: string, convId: string, member: string, seconds: number) {
		const exist = await this.memberRepository
			.query(`select from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND (members."status" = 'Owner' OR members."status" = 'Admin');`);
		if (!exist.length)
			return { err: 'Invalid data' };
		const memberId = await this.memberRepository
			.query(`select members.id from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${member}' AND (members."status" = 'Member' OR members."status" = 'Admin');`);
		if (!memberId.length)
			return { err: 'Invalid data' };
		await this.memberRepository
			.query(`update members set "status" = 'Muted' where members."id" = '${memberId[0].id}';`);
		const name: string = memberId[0].id;
		if (!this.schedulerRegistry.doesExist("cron", name)) {
			const job = new CronJob(new Date(Date.now() + seconds * 1000), async () => {
				await this.memberRepository
					.query(`update members set "leftDate" = null, "status" = 'Member' where members."id" = '${name}';`);
				this.schedulerRegistry.deleteCronJob(name);
			});
			this.schedulerRegistry.addCronJob(name, job);
			job.start();
		}
		return { data: true };
	}

	async updateChannel(login: string, convId: string, data: updateChannelDto) {
		const exist = await this.memberRepository
			.query(`select from members Join users ON members."userId" = users.id where members."conversationId" = '${convId}' AND users."login" = '${login}' AND (members."status" = 'Owner' OR members."status" = 'Admin');`);
		if (!exist.length) {
			deleteAvatar('channels', data.avatar);
			return { err: 'Invalid data' };
		}
		if (data.type === 'Protected' && !data.password) {
			deleteAvatar('channels', data.avatar);
			return { err: 'Please provide password' };
		}
		if (data.name)
			await this.setChannelName(convId, data.name);
		if (data.avatar) {
			data.avatar = await isFileValid('channels', data.avatar);
			if (!data.avatar)
				return { err: 'Invalid avatar format' };
		}
		if (data.avatar && data.oldPath)
			deleteOldAvatar('channels', data.oldPath);
		if (data.avatar) {
			await this.setChannelAvatar(convId, `http://${this.configService.get('SERVER_IP')}/uploads/channels/${data.avatar}`);
			resizeAvatar('channels', data.avatar);
		}
		if (data.type)
			await this.setChannelType(convId, data.type);
		if (data.password)
			await this.setChannelPassword(convId, data.password);
		return { data: true };
	}

	async setChannelName(convId: string, name: string) {
		return await this.conversationRepository
			.createQueryBuilder('conversations')
			.update({ name: name })
			.where('id = :id', { id: convId })
			.execute();
	}

	async setChannelType(convId: string, type: convType) {
		return await this.conversationRepository
			.createQueryBuilder('conversations')
			.update({ type: type })
			.where('id = :id', { id: convId })
			.execute();
	}

	async setChannelPassword(convId: string, password: string) {
		const encryptedPassword = await this.encryptPassword(password);
		return await this.conversationRepository
			.createQueryBuilder('conversations')
			.update({ password: encryptedPassword })
			.where('id = :id', { id: convId })
			.execute();
	}

	async setChannelAvatar(convId: string, avatar: string) {
		return await this.conversationRepository
			.createQueryBuilder('conversations')
			.update({ avatar: avatar })
			.where('id = :id', { id: convId })
			.execute();
	}
}
