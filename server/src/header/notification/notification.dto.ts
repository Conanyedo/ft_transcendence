import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { notifStatus, notifType } from "./notification.entity";

export class notificationCreateDto {

	@IsNotEmpty()
	from: string;

	@IsNotEmpty()
	to: string;

	@IsNotEmpty()
	gameId?: string;

	@IsNotEmpty()
	type: notifType;
}

export class notificationDto {

	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	status: notifStatus;

	@IsNotEmpty()
	gameId: string;

	@IsNotEmpty()
	type: notifType;
}