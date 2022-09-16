import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { JwtAuthService } from 'src/2fa-jwt/jwt/jwt-auth.service';
import { friendDto } from 'src/friendship/friendship.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Conversation, Message } from './chat.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Conversation)
		private conversationRepository: Repository<Conversation>,
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		private userService: UserService,
		private jwtService: JwtAuthService,
	) { }

	async getConversations(login: string) {
		const convs: Conversation[] = await this.conversationRepository
			.createQueryBuilder('conversations')
			.where('conversations.sender = :login OR conversations.receiver = :login', { login: login })
			.orderBy('conversations.lastUpdate', 'DESC')
			.getMany();
		if (!convs.length)
			return null;
		const conversations = await Promise.all(convs.map(async (conv) => {
			const friend: string = (conv.sender === login) ? conv.receiver : conv.sender;
			const friendInfo: friendDto = await this.userService.getFriend(friend);
			return { convId: conv.id, ...friendInfo }
		}))
		return [...conversations];
	}

	async getMessages(convId: string) {
		const msgs: Message[] = await this.messageRepository
			.query(`SELECT messages."sender", messages."msg", messages."createDate" FROM messages where messages."conversationId" = '${convId}' order by messages."createDate" DESC;`)
		if (!msgs.length)
			return null;
		return [...msgs];
	}

	async storeMsg(msg: string, sender: string, convId: Conversation) {
		let msgs: Message = new Message();
		msgs.msg = msg;
		msgs.sender = sender;
		msgs.conversation = convId;
		msgs = await this.messageRepository.save(msgs);
		return msgs.createDate;
	}

	async createConv(sender: string, receiver: string) {
		console.log('Receiver: ', receiver);
		let conv: Conversation = new Conversation();
		conv.sender = sender;
		conv.receiver = receiver;
		return await this.conversationRepository.save(conv);
	}

	async sendMsg(login: string, friend: string) {

	}
}
