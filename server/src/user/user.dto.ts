import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class userDto {

	@IsNotEmpty()
	id?: string;

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	avatar: string;

	@IsBoolean()
	isAuthenticated?: boolean;

	@IsString()
	_2faSecret?: string;

	@IsBoolean()
	is2faEnabled?: boolean;
}