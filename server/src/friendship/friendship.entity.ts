import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'friendships' })
export class Friendship {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	user: string;

	@Column()
	friend: string;

}
