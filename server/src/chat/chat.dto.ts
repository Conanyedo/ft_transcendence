import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class createMsgDto {

	@IsNotEmpty()
	msg: string;

	@IsNotEmpty()
	receiver: string;

}
