import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { NotificationService } from "./notification.service";
import { Notification, notifMsg } from './notification.entity';
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";
import { UserService } from "src/user/user.service";
import { notificationDto } from "./notificatios.dto";

class Online {
	constructor(public socket: Socket, public login: string) { }
}

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private notifService: NotificationService,
		private userService: UserService
	) { }

	@WebSocketServer()
	server: Server;

	online: Online[] = [];

	async handleConnection(@ConnectedSocket() client: Socket) {
		console.log('Connected', client.id);
		this.notifService.connectClient(client);
	}

	async handleDisconnect(@ConnectedSocket()client: Socket) {
		console.log('Disconneted');
		this.notifService.disconnectClient(client);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('addFriend')
	async sendNotif(@User('login') login: string, @MessageBody() friend: string) {
		await this.notifService.saveNofit({ from: login, to: friend, read: false, msg: notifMsg.INVITATION });
		await this.notifService.sendNotif(this.server, friend);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getNotif')
	async getNotifs(@User('login') login: string, @ConnectedSocket() client: Socket) {
		const notifs: notificationDto[] = await this.notifService.getNotifs(login);
		this.server.to(client.id).emit('Notif', notifs);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('allRead')
	async setRead(@User('login') login: string, @ConnectedSocket() client: Socket) {
		await this.notifService.setRead(login);
		const notifs: notificationDto[] = await this.notifService.getNotifs(login);
		this.server.to(client.id).emit('Notif', notifs);
	}
}
