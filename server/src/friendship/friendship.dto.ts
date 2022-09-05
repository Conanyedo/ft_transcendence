import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class friendshipDto {

	@IsNotEmpty()
	id?: string;

	@IsNotEmpty()
	user: string;

	@IsNotEmpty()
	friend: string;

}

export class friendDto {

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	status?: string;

}
