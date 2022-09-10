import { UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { NotificationService } from "./notification.service";
import { Notification, notifMsg } from './notification.entity';
import { User } from "src/user/user.decorator";
import { WsJwtGuard } from "src/2fa-jwt/jwt/jwt-ws.guard";

class Online {
	constructor(public socket: Socket, public login: string) {}
}

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(private notifService: NotificationService) {}

	@WebSocketServer()
	server: Server;

	online: Online[] = [];

	handleConnection(client: Socket) {
		console.log('Connection : ', client.id);
		const payload = this.notifService.connectClient(client);
		if (payload)
			this.online.push(new Online(client, payload.login));
	}

	handleDisconnect(client: any) {
		this.online = this.online.filter((user) => user.socket !== client)
		console.log('Disconneted');
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('addFriend')
	addFriend(@User('login') login: string, @MessageBody() data: string) {
		console.log('login: ', login);
		console.log('friend: ', data);
		// const client = this.online.find((el) => el.login === data).socket;
		// client.emit('Notif', { login: login, msg: notifMsg.INVITATION });
	}

	// @SubscribeMessage('getNotifs')
	// getNotifs(@MessageBody() data) {
	// 	this.server.emit(`${data.to}`, { login: data.from, msg: data.msg });
	// }
}
