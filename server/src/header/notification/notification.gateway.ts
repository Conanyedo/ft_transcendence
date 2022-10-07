import { forwardRef, Inject, UseGuards, ValidationPipe } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { NotificationService } from "./notification.service";
import { notifType } from './notification.entity';
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";
import { gameInvitValidate, gameUpdateValidate, notificationDto } from "./notification.dto";
import { loginValidate } from "src/friendship/friendship.dto";

@WebSocketGateway()
export class NotificationGateway {

	constructor(
		@Inject(forwardRef(() => NotificationService))
		private notifService: NotificationService
	) { }

	@WebSocketServer()
	server: Server;

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendRequest')
	async sendRequest(@User('login') login: string, @MessageBody(ValidationPipe) data: loginValidate) {
		const notif = await this.notifService.saveNofit({ from: login, to: data.login, type: notifType.INVITATION });
		await this.notifService.sendNotif(notif, data.login);
		return { data: true };
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendGame')
	async sendGame(@User('login') login: string, @MessageBody(ValidationPipe) data: gameInvitValidate) {
		const notif = await this.notifService.saveNofit({ from: login, to: data.player, gameId: data.gameId, type: notifType.GAME });
		await this.notifService.sendNotif(notif, data.player);
		return { data: true };
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('updateGame')
	async updateGame(@User('login') login: string, @MessageBody(ValidationPipe) data: gameUpdateValidate) {
		await this.notifService.updateGameNotif(data.notifId, data.status);
		return { data: true };
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getNotif')
	async getNotifs(@User('login') login: string) {
		const notifs: notificationDto[] = await this.notifService.getNotifs(login);
		return { data: notifs };
	}

}
