import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Socket } from 'socket.io'
import { JwtAuthService } from 'src/2fa-jwt/jwt/jwt-auth.service';

@Injectable()
export class NotificationService {

	constructor(
		@InjectRepository(Notification)
		private notifRepository: Repository<Notification>,
		private jwtService: JwtAuthService
	) { }

	connectClient(client: Socket) {
		let token = client.handshake.headers.authorization;
		token = token.split(' ')[1];
		try {
			const payload = this.jwtService.verify(token);
			return (payload);
		}
		catch (e) {
			client.disconnect();
			return null;
		}
	}

	// saveNofit(data: Notification) {
	// 	const notif: Notification = new Notification();
	// 	notif.from = data.from;
	// 	notif.to = data.to;
	// 	notif.msg = data.msg;
	// 	this.notifRepository.save(notif);
	// }
}
