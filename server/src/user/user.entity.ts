import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
	@PrimaryColumn()
	id: number;

	@Column()
	login: string;

	@Column()
	fullname: string;

	@Column({ unique: true })
	email: string;

	@Column()
	avatar: string;

}