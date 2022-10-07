import { forwardRef, Inject, UseGuards, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";
import { ChatService } from "./chat.service";
import { convIdValidate, createMsgDto, msgDto, updateInvitationDto } from "./chat.dto";
import { userParitalDto } from "src/user/user.dto";

@WebSocketGateway()
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
	async getConversations(@User('login') login: string) {
		return await this.chatService.getConversations(login);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getMsgs')
	async getMsgs(@User() user: userParitalDto, @MessageBody(ValidationPipe) data: convIdValidate) {
		return await this.chatService.getMessages(user.login, user.id, data.convId);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('updateInvitation')
	async updateInvitation(@User('login') login: string, @MessageBody(ValidationPipe) data: updateInvitationDto) {
		return await this.chatService.updateInvitation(login, data.convId, data.msgId, data.status);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMsg')
	async sendMsg(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody(ValidationPipe) data: createMsgDto) {
		let msg: msgDto;
		if (!data.convId && data.receiver)
			msg = await this.chatService.createNewDm(client, data);
		else
			msg = await this.chatService.createNewMessage(login, data);
		if (!msg)
			return msg;
		if (typeof msg === "string")
			return { err: msg };
		const sockets: string[] = await this.chatService.getRoomSockets(login, msg.convId);
		sockets.forEach((socket) => (this.server.to(socket).emit('newMsg', { data: msg })))
		return { data: msg.convId };
	}

}
