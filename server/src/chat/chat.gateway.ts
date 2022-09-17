import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";
import { ChatService } from "./chat.service";
import { Conversation } from "./chat.entity";
import { createMsgDto, msgDto } from "./chat.dto";

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
		// console.log('Disconneted');
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getConversations')
	async getConversations(@User('login') login: string, @ConnectedSocket() client: Socket) {
		const convs = await this.chatService.getConversations(login);
		console.log('Conversations: ', convs);
		// client.emit('conversations', convs);
		return convs;
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getMsgs')
	async getMsgs(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() convId: string) {
		const msgs = this.chatService.getMessages(convId);
		console.log('Messages: ', msgs);
		// client.emit('msgs', msgs);
		return msgs;
	}

	// @UseGuards(WsJwtGuard)
	// @SubscribeMessage('createConv')
	// async createConv(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() data: createMsgDto) {
	// 	const conv: Conversation = await this.chatService.createConv(login, data.receiver);
	// 	const date = await this.chatService.storeMsg(data.msg, login, conv);
	// 	client.join(conv.id);
	// 	const sockets = await this.server.fetchSockets();
	// 	const friendSocket = sockets.find((socket) => (socket.data.login === data.receiver))
	// 	if (friendSocket)
	// 		friendSocket.join(conv.id);
	// 	const msg: msgDto = {msg: data.msg, sender: login, date: date, convId: conv.id};
	// 	this.server.to(conv.id).emit('newMsg', msg);
	// }

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMsg')
	async sendMsg(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() data: createMsgDto) {
		let msg: msgDto;
		if (!data.convId)
			msg = await this.chatService.createNewConv(this.server, login, client, data)
		else
			msg = await this.chatService.createNewMessage(login, data);
		this.server.to(msg.convId).emit('newMsg', msg);
	}

}
