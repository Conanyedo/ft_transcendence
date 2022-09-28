import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum userAchievements {
	FIRSTWIN = 1,
	WON10 = 2,
	WON20 = 3,
	LEVEL5 = 4,
	GOLDTIER = 5,
	FIRSTPLACE = 6,
}

@Entity({ name: 'stats' })
export class Stats {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ default: 0 })
	XP: number;

	@Column({ default: 0 })
	GP: number;

	@Column({ default: 0 })
	rank: number;

	@Column({ default: 0 })
	numGames: number;

	@Column({ default: 0 })
	gamesWon: number;

	@Column({
		type: "enum",
		enum: userAchievements,
		array: true,
		default: []
	})
	achievement: userAchievements[];
}