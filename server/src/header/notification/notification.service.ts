import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotificationService {

	constructor(
		@InjectRepository(Notification)
		private notifRepository: Repository<Notification>,
	) { }

	async getNotif(login: string): Promise<Observable<MessageEvent>> {
		const notifs: Notification[] = await this.notifRepository
			.createQueryBuilder('notifications')
			.select(['notifications.from', 'notifications.to', 'notifications.msg'])
			.where('notifications.to = :login', { login: login })
			.getMany();
		if (!notifs)
			return null;
		const msgs = notifs.map((notif) => {
			return { login: notif.from, msg: notif.msg };
		})
		return interval(1000).pipe(
			map((_) => ({ data: msgs } as MessageEvent)),
		);
	}
}
