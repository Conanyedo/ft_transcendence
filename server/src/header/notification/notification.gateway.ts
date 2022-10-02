import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { NotificationService } from "./notification.service";
import { notifType } from './notification.entity';
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";
import { UserService } from "src/user/user.service";
import { notificationDto } from "./notification.dto";

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class NotificationGateway {

	constructor(
		@Inject(forwardRef(() => NotificationService))
		private notifService: NotificationService
	) { }

	@WebSocketServer()
	server: Server;

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendRequest')
	async sendRequest(@User('login') login: string, @MessageBody() friend: string) {
		const notif = await this.notifService.saveNofit({ from: login, to: friend, type: notifType.INVITATION });
		await this.notifService.sendNotif(notif, friend);
		return true;
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendGame')
	async sendGame(@User('login') login: string, @MessageBody('player') player: string, @MessageBody('gameId') gameId: string) {
		const notif = await this.notifService.saveNofit({ from: login, to: player, gameId: gameId, type: notifType.GAME });
		await this.notifService.sendNotif(notif, player);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getNotif')
	async getNotifs(@User('login') login: string, @ConnectedSocket() client: Socket) {
		const notifs: notificationDto[] = await this.notifService.getNotifs(login);
		this.server.to(client.id).emit('Notif', { data: notifs });
	}

}
