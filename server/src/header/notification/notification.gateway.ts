import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'

@WebSocketGateway()
export class NotificationGateway implements OnModuleInit{

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('mr7ba bik a ', socket.id);
		})
	}

	@SubscribeMessage('events')
	handleEvent(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('onMessage', {
			msg: 'New message',
			content: body,
		})
	}
}