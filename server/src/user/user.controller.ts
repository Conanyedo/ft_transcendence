import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { userDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

	constructor(private readonly userService: UserService) {}

	// @Post('/register')
	// @UsePipes(ValidationPipe)
	// async doUserRegistration(@Body() userRegister: userDto) {
	// 	return await this.userService.registerUser(userRegister);
	// }
}
