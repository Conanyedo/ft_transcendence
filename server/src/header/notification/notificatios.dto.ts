import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { notifMsg } from "./notification.entity";

export class notificationCreateDto {

	@IsNotEmpty()
	from: string;

	@IsNotEmpty()
	to: string;

	@IsNotEmpty()
	read: boolean;

	@IsNotEmpty()
	msg: notifMsg;
}

export class notificationDto {

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	read: boolean;

	@IsNotEmpty()
	msg: notifMsg;
}