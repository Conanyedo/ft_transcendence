import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stats } from "./stats.entity";

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn("uuid" )
	id: string;

	@Column()
	login: string;

	@Column()
	fullname: string;

	@Column({ unique: true })
	email: string;

	@Column()
	avatar: string;

	@Column({ default: false})
	isAuthenticated: boolean;

	@Column({ nullable: true})
	_2faSecret: string;

	@Column({ default: false })
	is2faEnabled: boolean;

	@OneToOne(() => Stats)
	@JoinColumn()
	stats: Stats;
}