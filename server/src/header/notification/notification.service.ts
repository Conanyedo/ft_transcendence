import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Server, Socket } from 'socket.io'
import { JwtAuthService } from 'src/2fa-jwt/jwt/jwt-auth.service';
import { UserService } from 'src/user/user.service';
import { notificationCreateDto, notificationDto } from './notification.dto';

@Injectable()
export class NotificationService {

	constructor(
		@InjectRepository(Notification)
		private notifRepository: Repository<Notification>,
		private jwtService: JwtAuthService,
		private userService: UserService
	) { }

	async connectClient(client: Socket) {
		const token = client.handshake.headers.authorization.split(' ')[1];
		try {
			const payload = this.jwtService.verify(token);
			this.userService.setSocketId(payload.id, client.id);
		}
		catch (e) {
			client.disconnect();
		}
	}

	async disconnectClient(client: Socket) {
		const token = client.handshake.headers.authorization.split(' ')[1];
		try {
			const payload = this.jwtService.verify(token);
			this.userService.setSocketId(payload.id, null);
			client.disconnect();
		}
		catch (e) {
			client.disconnect();
		}
	}

	async getNotifs(login: string) {
		const notifs: Notification[] = await this.notifRepository
			.createQueryBuilder('notifications')
			.select(['notifications.from', 'notifications.read', 'notifications.msg'])
			.where('notifications.to = :login', { login: login })
			.getMany()
		if (!notifs.length)
			return null;
		const list = notifs.map((el) => ({ login: el.from, msg: el.msg, read: el.read }));
		return [...list];
	}

	async setRead(login: string) {
		await this.notifRepository
			.createQueryBuilder('notifications')
			.update({ read: true })
			.where('to = :login', { login: login })
			.execute();
	}

	async saveNofit(data: notificationCreateDto) {
		const notif: Notification = new Notification();
		notif.from = data.from;
		notif.to = data.to;
		notif.msg = data.msg;
		await this.notifRepository.save(notif);
	}

	async sendNotif(server: Server, friend: string) {
		const client = await this.userService.getSocketId(friend);
		if (!client)
			return;
		const notifs: notificationDto[] = await this.getNotifs(friend);
		server.to(client).emit('Notif', notifs);
	}
}
