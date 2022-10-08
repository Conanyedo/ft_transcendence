import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Matches, Max, Min } from "class-validator";
import { convType, invStatus, memberStatus } from "./chat.entity";

export class passwordValidate {
	@IsOptional()
	@Matches(/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/, { message: 'Password must contain at least 8 characters.At least one number, one uppercase letter and one special character' })
	password: string;
};

export class nameValidate {
	@IsNotEmpty()
	@IsString()
	@Length(2, 20)
	@Matches(/^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	name: string;
};

export class convIdValidate {
	@IsUUID()
	convId: string;
};

export class memberValidate {
	@IsNotEmpty()
	@IsString()
	@Length(4, 20)
	@Matches(/^(?=.{4,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	member: string;
};

export class membersValidate {
	@IsArray()
	@IsString({ each: true })
	@Length(4, 20, { each: true })
	@Matches(/^(?=.{4,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/, { each: true })
	members: string[];
};

export class memberStatusValidate {
	@IsNotEmpty()
	@IsEnum(memberStatus, { each: true, message: 'Invalid member status' })
	status: memberStatus;
};

export class secondsValidate {
	@IsNumber()
	@Min(5)
	@Max(2592000)
	seconds: number;
};

export class createMsgDto {

	@IsOptional()
	@IsString()
	msg: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@Length(4, 20)
	@Matches(/^(?=.{4,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	receiver: string;

	@IsOptional()
	@IsUUID()
	convId: string;

	@IsOptional()
	@IsString()
	invitation: string;

}

export class updateInvitationDto {

	@IsUUID()
	convId: string;

	@IsUUID()
	msgId: string;

	@IsNotEmpty()
	@IsEnum(invStatus, { each: true, message: 'Invalid invitation status' })
	status: invStatus;
}

export class createChannelDto {

	@IsNotEmpty()
	@IsString()
	@Length(2, 20)
	@Matches(/^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	name: string;

	@IsNotEmpty()
	@IsEnum(convType, { each: true, message: 'Conversation must be either Public, Protected or Private' })
	type: convType;

	@IsArray()
	@IsString({ each: true })
	@Length(4, 20, { each: true })
	@Matches(/^(?=.{4,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/, { each: true })
	members: string[];

	@IsOptional()
	@Matches(/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/, { message: 'Password must contain at least 8 characters.At least one number, one uppercase letter and one special character' })
	password: string;

}

export class updateChannelDto {

	@IsOptional()
	@IsString()
	@Length(2, 20)
	@Matches(/^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	name: string;

	@IsOptional()
	@IsEnum(convType, { each: true, message: 'Conversation must be either Public, Protected or Private' })
	type: convType;

	@IsOptional()
	@Matches(/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/, { message: 'Password must contain at least 8 characters.At least one number, one uppercase letter and one special character' })
	password: string;

	@IsOptional()
	@IsString()
	avatar: string;

	@IsOptional()
	@IsString()
	oldPath: string;
}

export interface conversationDto {
	convId: string;
	type: string;
	relation: string;
	name?: string;
	login?: string;
	avatar?: string;
	status?: string;
	membersNum?: number;
	lastUpdate?: Date;
}

export interface createMemberDto {
	status: memberStatus;
	login: string;
}

export interface createConvDto {
	name?: string;
	type: convType;
	password?: string;
	avatar?: string;
}

export interface msgDto {
	msg: string;
	sender: string;
	fullname?: string;
	invitation: string;
	status: invStatus;
	date: Date;
	convId: string;
	msgId: string;
}

