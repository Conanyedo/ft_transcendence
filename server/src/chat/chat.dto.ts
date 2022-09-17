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
