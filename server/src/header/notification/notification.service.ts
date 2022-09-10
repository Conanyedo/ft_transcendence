import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, notifMsg } from './notification.entity';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client'

@Injectable()
export class NotificationService implements OnModuleInit {

	private socket: Socket;

	constructor(
		@InjectRepository(Notification)
		private notifRepository: Repository<Notification>
	) {
		this.socket = io('http://localhost:5000');
	}

	onModuleInit() {
		this.socket.on('connect', () => {
			console.log('Connected to Gateway');
		})
	}

	addFriendNotif(user: string, friend: string) {
		this.socket.emit('addFriend', { from: user, to: friend, msg: notifMsg.INVITATION });
		this.socket.on('storeNotif', (data: Notification) => {
			const notif: Notification = new Notification();
			notif.from = data.from;
			notif.to = data.to;
			notif.msg = data.msg;
			this.notifRepository.save(notif);
		})
	}

	// async getNotif(login: string): Promise<Observable<MessageEvent>> {
	// 	let length = 0;
	// 	return interval(1000).pipe(switchMap(async (index) => {
	// 		const notifs: Notification[] = await this.notifRepository
	// 			.createQueryBuilder('notifications')
	// 			.select(['notifications.from', 'notifications.to', 'notifications.msg'])
	// 			.where('notifications.to = :login', { login: login })
	// 			.getMany();
	// 		if (!notifs)
	// 			return null;
	// 		if (!notifs.length || notifs.length === length)
	// 			return null;
	// 		else {
	// 			length = notifs.length;
	// 			const msg = notifs.map((notif) => ({ login: notif.from, msg: notif.msg }))
	// 			return ({ data: msg } as MessageEvent)
	// 		}
	// 	})
	// 	);
	// }
}
