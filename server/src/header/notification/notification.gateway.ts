import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { NotificationService } from "./notification.service";
import { Notification, notifMsg } from './notification.entity';

@WebSocketGateway()
export class NotificationGateway implements OnModuleInit {

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('Connection : ', socket.id);
		})
	}

	@SubscribeMessage('addFriend')
	addFriend(@MessageBody() data: Notification) {
		console.log(data);
		this.server.emit(`${data.to}`, {login: data.from, msg: data.msg}, (ack: string) => {
			console.log('ack : ', ack);
			if (!ack)
				this.server.emit('storeNotif', data);
		});
	}
}