import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/user.entity";
import { Conversation, convType, invStatus, memberStatus } from "./chat.entity";

export class createMsgDto {

	@IsNotEmpty()
	msg: string;

	@IsString()
	receiver?: string;

	@IsString()
	convId?: string;

	@IsString()
	invitation?: string;

}

export class createMemberDto {

	@IsNotEmpty()
	status: memberStatus;

	@IsNotEmpty()
	login: string;

}

export class createConvDto {

	@IsNotEmpty()
	name?: string;

	@IsNotEmpty()
	type: convType;
	
	@IsString()
	password?: string;
	
	@IsString()
	avatar?: string;

}

export class createChannelDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	type: convType;

	@IsNotEmpty()
	members: string[];

	@IsNotEmpty()
	password: string;

}

export class updateChannelDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	type: convType;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	oldPath: string;
}

export class msgDto {

	@IsNotEmpty()
	msg: string;

	@IsNotEmpty()
	sender: string;

	@IsNotEmpty()
	invitation: string;

	@IsNotEmpty()
	status: invStatus;

	@IsNotEmpty()
	date: Date;

	@IsNotEmpty()
	convId: string;

}

export class conversationDto {

	@IsNotEmpty()
	convId: string;

	@IsNotEmpty()
	type: string;

	@IsNotEmpty()
	relation: string;

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

}
