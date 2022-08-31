import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'stats' })
export class Stats {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ default: 0})
	XP: number;

	@Column({ default: 0})
	GP: number;

	@Column({ default: 0})
	rank: number;

	@Column({ default: 0})
	numGames: number;

	@Column({ default: 0})
	gamesWon: number;
	

}