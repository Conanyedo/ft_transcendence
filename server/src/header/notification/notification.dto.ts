import { IsEnum, IsNotEmpty, IsString, IsUUID, Length, Matches } from "class-validator";
import { notifStatus, notifType } from "./notification.entity";

export class gameInvitValidate {
	@IsNotEmpty()
	@IsString()
	@Length(4, 20)
	@Matches(/^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	player: string;

	@IsNotEmpty()
	@IsString()
	gameId: string;
}

export class gameUpdateValidate {
	@IsUUID()
	notifId: string;

	@IsNotEmpty()
	@IsEnum(notifStatus, { each: true, message: 'Status must be either Sent, Accepted or Refused' })
	status: notifStatus;
}

export interface notificationCreateDto {
	from: string;
	to: string;
	gameId?: string;
	type: notifType;
}

export interface notificationDto {
	login: string;
	fullname: string;
	avatar: string;
	status: notifStatus;
	gameId: string;
	type: notifType;
}