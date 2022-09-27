import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class gameDto {

	@IsNotEmpty()
	id?: string;

	@IsNotEmpty()
	playerOne: string;

	@IsNotEmpty()
	playerTwo: string;

	@IsNotEmpty()
	playerOneScore: number;

	@IsNotEmpty()
	playerTwoScore: number;

	@IsNotEmpty()
	gameType: string;

	@IsDate()
	date?: Date;
}

export class opponentDto {

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	avatar: string;

}

export class historyDto {

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	opponentScore: number;

	@IsNotEmpty()
	yourScore: number;

	@IsNotEmpty()
	date: string;
}