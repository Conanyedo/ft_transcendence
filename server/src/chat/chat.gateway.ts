import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";
import { ChatService } from "./chat.service";
import { Conversation, invStatus } from "./chat.entity";
import { createMsgDto, msgDto } from "./chat.dto";
import { userParitalDto } from "src/user/user.dto";

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class ChatGateway {

	constructor(
		@Inject(forwardRef(() => ChatService))
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
		return await this.chatService.getConversations(login);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getMsgs')
	async getMsgs(@User() user: userParitalDto, @ConnectedSocket() client: Socket, @MessageBody() convId: string) {
		return await this.chatService.getMessages(user.login, user.id, convId);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('updateInvitation')
	async updateInvitation(@User('login') login: string, @MessageBody('convId') convId: string, @MessageBody('msgId') msgId: string, @MessageBody('status') status: invStatus) {
		return await this.chatService.updateInvitation(login, convId, msgId, status);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMsg')
	async sendMsg(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() data: createMsgDto) {
		let msg: msgDto;
		if (!data.convId && data.receiver)
			msg = await this.chatService.createNewDm(client, data);
		else
			msg = await this.chatService.createNewMessage(login, data);
		if (typeof msg === "string")
			return { data: msg };
		const sockets: string[] = await this.chatService.getRoomSockets(login, msg.convId);
		sockets.forEach((socket) => (this.server.to(socket).emit('newMsg', { data: msg })))
		return { data: true };
		// this.server.to(msg.convId).emit('newMsg', msg);
	}

}
