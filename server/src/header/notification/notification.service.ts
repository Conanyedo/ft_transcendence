import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, notifStatus } from './notification.entity';
import { UserService } from 'src/user/user.service';
import { notificationCreateDto } from './notification.dto';
import { opponentDto } from 'src/game/game.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {

	constructor(
		@InjectRepository(Notification)
		private notifRepository: Repository<Notification>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		@Inject(forwardRef(() => NotificationGateway))
		private notifGateway: NotificationGateway,
	) { }

	async getNotifId(from: string, to: string) {
		const notif: Notification = await this.notifRepository
			.createQueryBuilder('notifications')
			.select(['notifications.id'])
			.where(`notifications.from = '${from}' AND notifications.to = '${to}' AND notifications.status = '${notifStatus.SENT}'`)
			.getOne();
		return notif;
	}

	async getNotifs(login: string) {
		const notifs: Notification[] = await this.notifRepository
			.createQueryBuilder('notifications')
			.select(['notifications.id', 'notifications.from', 'notifications.status', 'notifications.gameId', 'notifications.type'])
			.where('notifications.to = :login', { login: login })
			.orderBy('notifications.date', 'DESC')
			.getMany()
		if (!notifs.length)
			return [];
		const notifList = await Promise.all(notifs.map(async (notif) => {
			const userInfo: opponentDto = await this.userService.getOpponent(notif.from);
			return { notifId: notif.id, fullname: userInfo.fullname, avatar: userInfo.avatar, login: notif.from, type: notif.type, status: notif.status, gameId: notif.gameId }
		}));
		return [...notifList];
	}

	async updateNotif(from: string, to: string, status: notifStatus) {
		const notif: Notification = await this.getNotifId(from, to);
		if (!notif)
			return false;
		await this.notifRepository
			.createQueryBuilder()
			.update({ status: status })
			.where(`notifications.id = '${notif.id}'`)
			.execute();
		return true;
	}

	async updateGameNotif(notifId: string, status: notifStatus) {
		await this.notifRepository
			.createQueryBuilder()
			.update({ status: status })
			.where(`notifications.id = '${notifId}'`)
			.execute();
		return true;
	}

	async saveNofit(data: notificationCreateDto) {
		let notif: Notification = new Notification();
		notif.from = data.from;
		notif.to = data.to;
		notif.type = data.type;
		notif.gameId = data.gameId;
		notif = await this.notifRepository.save(notif);
		return notif;
	}

	async sendNotif(notif: Notification, friend: string) {
		const sockets = await this.notifGateway.server.fetchSockets();
		const clients = sockets.filter((socket) => (socket.data.login === friend));
		if (!clients.length)
			return;
		const userInfo: opponentDto = await this.userService.getOpponent(notif.from);
		const newNotif = { notifId: notif.id, fullname: userInfo.fullname, avatar: userInfo.avatar, login: notif.from, type: notif.type, status: notif.status, gameId: notif.gameId }
		clients.forEach((client) => (this.notifGateway.server.to(client.id).emit('Notif', { data: [newNotif] })))
		;
	}
}
