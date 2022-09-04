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

	@IsDate()
	date?: Date;
}