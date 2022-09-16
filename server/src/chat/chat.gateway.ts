import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";
import { ChatService } from "./chat.service";
import { Conversation } from "./chat.entity";
import { createMsgDto } from "./chat.dto";

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly chatService: ChatService,
	) { }

	@WebSocketServer()
	server: Server;

	async handleConnection(@ConnectedSocket() client: Socket) {
		console.log('Connected chat: ', client.id);
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		console.log('Disconneted');
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getConversations')
	async getConversations(@User('login') login: string, @ConnectedSocket() client: Socket) {
		let convs = await this.chatService.getConversations(login);
		console.log('Conversations: ', convs);
		client.emit('conversations', convs);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getMsgs')
	async getMsgs(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() convId: string) {
		const msgs = this.chatService.getMessages(convId);
		console.log('Messages: ', msgs);
		client.emit('msgs', msgs);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('createConv')
	async createConv(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() data: createMsgDto) {
		const convId: Conversation = await this.chatService.createConv(login, data.receiver);
		await this.chatService.storeMsg(data.msg, login, convId);
		console.log('Sockets: ', this.server.sockets);
		
		// client.join(convId.id);
		// client.to().emit('nweMsg', data.msg);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMsg')
	async sendMsg(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() data) {
		if (!data.convId) {
			const convId: Conversation = await this.chatService.createConv(login, data.receiver);
			await this.chatService.storeMsg(data.msg, login, convId);
		}
		// const msgs = this.chatService.getMessages(convId);
		// console.log('Messages: ', msgs);
		// client.emit('msgs', msgs);
	}

}
