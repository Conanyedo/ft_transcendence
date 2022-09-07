import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, notifMsg } from './notification.entity';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class NotificationService {

	constructor(
		@InjectRepository(Notification)
		private notifRepository: Repository<Notification>,
	) { }

	addNotif(user: string, friend: string) {
		const notif: Notification = new Notification();
		notif.from = user;
		notif.to = friend;
		notif.msg = notifMsg.INVITATION;
		this.notifRepository.save(notif);
	}

	async getNotif(login: string): Promise<Observable<MessageEvent>> {
		let length = 0;
		return interval(1000).pipe(switchMap(async (index) => {
			const notifs: Notification[] = await this.notifRepository
				.createQueryBuilder('notifications')
				.select(['notifications.from', 'notifications.to', 'notifications.msg'])
				.where('notifications.to = :login', { login: login })
				.getMany();
			if (!notifs)
				return null;
			if (!notifs.length || notifs.length === length)
				return null;
			else {
				length = notifs.length;
				const msg = notifs.map((notif) => ({login: notif.from, msg: notif.msg}))
				return ({ data: msg } as MessageEvent)
			}
		})
		);
	}
}
