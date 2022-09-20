import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { Server, Socket } from 'socket.io';
import { friendDto } from 'src/friendship/friendship.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { conversationDto, createConvDto, createMemberDto, createMsgDto, msgDto } from './chat.dto';
import { Conversation, convType, Member, memberStatus, Message } from './chat.entity';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Conversation)
		private conversationRepository: Repository<Conversation>,
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		@InjectRepository(Member)
		private memberRepository: Repository<Member>,
		private userService: UserService,
		@Inject(forwardRef(() => ChatGateway))
		private chatGateway: ChatGateway
	) { }

	async joinConversations(client: Socket) {
		const convs: conversationDto[] = await this.memberRepository
			.query(`select conversations.id as "convId" from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where users."login" = '${client.data.login}';`);
		if (!convs.length)
			return;
		convs.forEach((conv) => (client.join(conv.convId)));
	}

	async getFriend(login: string) {
		return await this.userService.getFriend(login);
	}

	async getConversations(login: string) {
		const convs: conversationDto[] = await this.memberRepository
			.query(`select conversations.id as "convId", conversations.type, conversations.avatar, conversations.name from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where users."login" = '${login}';`);
		const conversations: conversationDto[] = await Promise.all(convs.map(async (conv) => {
			const convInfo: conversationDto = { ...conv }
			if (conv.type === 'Dm') {
				const users = await this.memberRepository
					.query(`select users.login, users.fullname, users.status, users.avatar from members Join users ON members."userId" = users.id where members."conversationId" = '${conv.convId}' AND users.login != '${login}';`);
				convInfo.name = users[0].fullname;
				convInfo.login = users[0].login;
				convInfo.status = users[0].status;
				convInfo.avatar = users[0].avatar;
			}
			else {
				const membersNum = await this.memberRepository
					.query(`select COUNT(*) from members where members."conversationId" = '${convInfo.convId}';`);
				convInfo.login = convInfo.name;
				convInfo.membersNum = membersNum[0].count;
			}
			return convInfo;
		}))
		return [...conversations];
	}

	async createConv(newConv: createConvDto, members: createMemberDto[]) {
		let conv: Conversation = new Conversation();
		conv.type = newConv.type;
		conv.name = newConv.name;
		conv.password = newConv.password;
		conv = await this.conversationRepository.save(conv);

		members.forEach(async (mem) => {
			const member: Member = new Member();
			member.status = mem.status;
			member.conversation = conv;
			member.user = await this.userService.getUser(mem.login);
			this.memberRepository.save(member);
		});
		return conv;
	}

	async updateConvDate(convId: string, date: Date) {
		await this.conversationRepository
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

	async storeMsg(msg: string, sender: string, convId: Conversation) {
		let msgs: Message = new Message();
		msgs.msg = msg;
		msgs.sender = sender;
		msgs.conversation = convId;
		msgs = await this.messageRepository.save(msgs);
		return msgs.createDate;
	}

	async getMessages(convId: string) {
		const msgs: Message[] = await this.messageRepository
			.query(`SELECT messages."sender", messages."msg", messages."createDate", messages."conversationId" as "convId" FROM messages where messages."conversationId" = '${convId}' order by messages."createDate" ASC;`)
		if (!msgs.length)
			return null;
		return [...msgs];
	}

	async createNewDm(client: Socket, data: createMsgDto) {
		const newConv: createConvDto = { type: convType.DM };
		const newMember: createMemberDto[] = [
			{ status: memberStatus.MEMBER, login: client.data.login },
			{ status: memberStatus.MEMBER, login: data.receiver }
		];
		const conv: Conversation = await this.createConv(newConv, newMember);
		const date = await this.storeMsg(data.msg, client.data.login, conv);
		client.join(conv.id);
		const sockets = await this.chatGateway.server.fetchSockets();
		const friendSocket = sockets.find((socket) => (socket.data.login === data.receiver))
		if (friendSocket)
			friendSocket.join(conv.id);
		const msg: msgDto = { msg: data.msg, sender: client.data.login, date: date, convId: conv.id };
		return msg;
	}

	async createNewMessage(login: string, data: createMsgDto) {
		const conv = await this.getConvById(data.convId);
		const date = await this.storeMsg(data.msg, login, conv);
		this.updateConvDate(conv.id, date);
		const msg: msgDto = { msg: data.msg, sender: login, date: date, convId: conv.id };
		return msg;
	}

	async createChannel(owner: string, data: createConvDto) {

	}
}
