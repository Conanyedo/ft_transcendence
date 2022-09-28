import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { userAchievements } from "./stats.entity";

export class userDto {

	@IsNotEmpty()
	id?: string;

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	avatar: string;

	@IsBoolean()
	isAuthenticated?: boolean;

	@IsString()
	_2faSecret?: string;

	@IsBoolean()
	is2faEnabled?: boolean;
}

export class userParitalDto {

	@IsNotEmpty()
	id: string;

	@IsNotEmpty()
	login: string;

	@IsBoolean()
	isFirst?: boolean = false;
}

export class statsDto {

	@IsNotEmpty()
	id: string;

	@IsNotEmpty()
	XP: number;

	@IsNotEmpty()
	GP: number;

	@IsNotEmpty()
	numGames: number;

	@IsNotEmpty()
	gamesWon: number;

	@IsNotEmpty()
	rank: number;

	@IsNotEmpty()
	achievement: userAchievements[];
}

export class rankDto {

	@IsNotEmpty()
	id: string;

	@IsNotEmpty()
	XP: number;

	@IsNotEmpty()
	GP: number;

	@IsNotEmpty()
	rank: number;

}