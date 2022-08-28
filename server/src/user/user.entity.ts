import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

}