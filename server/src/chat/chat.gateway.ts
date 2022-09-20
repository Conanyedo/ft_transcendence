import { forwardRef, Inject, UseGuards } from "@nestjs/common";
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
	async getMsgs(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() convId: string) {
		return await this.chatService.getMessages(convId);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMsg')
	async sendMsg(@User('login') login: string, @ConnectedSocket() client: Socket, @MessageBody() data: createMsgDto) {
		let msg: msgDto;
		if (!data.convId)
			msg = await this.chatService.createNewDm(client, data)
		else
			msg = await this.chatService.createNewMessage(login, data);
		this.server.to(msg.convId).emit('newMsg', msg);
	}

}
