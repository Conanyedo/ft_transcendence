import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class createMsgDto {

	@IsNotEmpty()
	msg: string;

	@IsString()
	receiver?: string;

	@IsString()
	convId?: string;

}

export class msgDto {

	@IsNotEmpty()
	msg: string;

	@IsNotEmpty()
	sender: string;

	@IsNotEmpty()
	date: Date;

	@IsNotEmpty()
	convId: string;

}

export class conversationDto {

	@IsNotEmpty()
	convId: string;

	@IsString()
	name?: string;

	@IsString()
	login?: string;

	@IsString()
	avatar?: string;

	@IsString()
	status?: string;

	@IsString()
	membersNum?: number;

	@IsNotEmpty()
	type: string;

}
