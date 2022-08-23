import { IsEmail, IsNotEmpty } from "class-validator";

export class createUserDto {

	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	avatar: string;
}