import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'games' })
export class Game {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	playerOne: string;

	@Column()
	playerTwo: string;

	@Column()
	playerOneScore: number;

	@Column()
	playerTwoScore: number;

	@CreateDateColumn()
	date: Date;
}
