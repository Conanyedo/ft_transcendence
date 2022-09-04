import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'games' })
export class Frienship {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	user: string;

	@Column()
	friend: string;

}
