import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stats } from "./stats.entity";

export enum userStatus {
	ONLINE = "Online",
	OFFLINE = "Offline",
	INGAME = "In Game",
}

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	login: string;

	@Column()
	fullname: string;

	@Column({ unique: true })
	email: string;

	@Column()
	avatar: string;

	@Column({ type: 'enum', enum: userStatus, default: userStatus.ONLINE })
	status: userStatus;

	@Column({ default: false })
	isAuthenticated: boolean;

	@Column({ nullable: true })
	_2faSecret: string;

	@Column({ default: false })
	is2faEnabled: boolean;

	@OneToOne(() => Stats)
	@JoinColumn()
	stats: Stats;
}