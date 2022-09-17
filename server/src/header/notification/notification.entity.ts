import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum notifMsg {
	INVITATION = 'Request',
	GAME = 'Game',
}

@Entity({ name: 'notifications' })
export class Notification {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	from: string;

	@Column()
	to: string;

	@Column({ default: false })
	read: boolean;

	@Column({ type: 'enum', enum: notifMsg })
	msg: notifMsg;
}
