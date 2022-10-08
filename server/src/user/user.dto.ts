import { IsOptional, IsString, Length, Matches } from "class-validator";
import { userAchievements } from "./stats.entity";

export class updateProfileValidate {

	@IsOptional()
	@IsString()
	@Length(4, 20)
	@Matches(/^(?=.{4,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	fullname: string;

	@IsOptional()
	@IsString()
	oldPath: string;
}

export interface userParitalDto {
	id: string;
	login: string;
	isFirst?: boolean;
}

export interface userDto {
	id?: string;
	login: string;
	fullname: string;
	avatar: string;
	isAuthenticated?: boolean;
	_2faSecret?: string;
	is2faEnabled?: boolean;
}

export interface statsDto {
	id: string;
	XP: number;
	GP: number;
	numGames: number;
	gamesWon: number;
	rank: number;
	achievement: userAchievements[];
}

export interface rankDto {
	id: string;
	XP: number;
	GP: number;
	rank: number;
}

export interface leaderBoardDto {
	login: string;
	fullname: string;
	avatar: string;
	numGames: string;
	gamesWon: string;
	GP: number;
	rank: number;
	relation: string;
}