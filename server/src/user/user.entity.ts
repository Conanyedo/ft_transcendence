import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
	@PrimaryColumn({ default: '' })
	id: string;

	@Column()
	login: string;

	@Column()
	fullname: string;

	@Column({ unique: true })
	email: string;

	@Column()
	avatar: string;

}