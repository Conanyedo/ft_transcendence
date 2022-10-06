import { IsIn, IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";

export class is2faEnabledValidate {
	@IsNotEmpty()
	@IsString()
	@IsIn(['true', 'false'])
	is2faEnabled: string;
}

export class codeValidate {
	@IsNotEmpty()
	@IsNumberString()
	@Length(6)
	code: string;
}