import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum notifType {
	INVITATION = 'Request',
	GAME = 'Game',
}

export enum notifStatus {
	SENT = "Sent",
	ACCEPTED = "Accepted",
	REFUSED = "Refused",
}

@Entity({ name: 'notifications' })
export class Notification {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	from: string;

	@Column()
	to: string;

	@Column({ type: 'enum', enum: notifStatus, default: notifStatus.SENT })
	status: notifStatus;

	@Column({ default: null })
	gameId: string;

	@Column({ type: 'enum', enum: notifType })
	type: notifType;

	@CreateDateColumn()
	date: Date;
}
