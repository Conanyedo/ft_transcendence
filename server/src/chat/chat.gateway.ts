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
export class ChatGateway/* implements OnGatewayConnection, OnGatewayDisconnect*/ {

	constructor(
		private readonly chatService: ChatService,
	) { }

	@WebSocketServer()
	server: Server;

	async handleConnection(@ConnectedSocket() client: Socket) {
		this.chatService.joinConversations(client);
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
		const msgs = await this.chatService.getMessages(convId);
		console.log('Messages: ', msgs);
		// client.emit('msgs', msgs);
		return msgs;
	}

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
