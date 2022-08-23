import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { createUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@UsePipes(ValidationPipe)
	async doUserRegistration(@Body() userRegister: createUserDto) {
		return await this.userService.doUserRegistration(userRegister);
	}
}
