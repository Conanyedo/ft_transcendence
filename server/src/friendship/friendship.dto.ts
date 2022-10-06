import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class loginValidate {
	@IsNotEmpty()
	@IsString()
	@Length(4, 20)
	@Matches(/^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	login: string;
};


export interface friendshipDto {
	id?: string;
	user: string;
	friend: string;
}

export interface friendDto {
	login: string;
	fullname: string;
	avatar: string;
	status?: string;
}
