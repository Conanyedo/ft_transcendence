import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class searchValidate {
	@IsNotEmpty()
	@IsString()
	@Length(2, 20)
	@Matches(/^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	search: string;
}
