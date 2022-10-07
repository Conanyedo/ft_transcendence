import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class searchValidate {
	@IsNotEmpty()
	@IsString()
	@Matches(/^(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/)
	search: string;
}
