import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { userDto, userParitalDto } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../2fa-jwt/jwt/jwt-auth.guard';
import { User } from './user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadConfig } from 'src/config/upload.config';

@Controller('user')
export class UserController {

	constructor(private readonly userService: UserService) { }

	@Get('/info')
	@UseGuards(JwtAuthGuard)
	async getUserInfo(@User() user: userParitalDto) {
		return await this.userService.getUserInfo(user.id);
	}

	@Get('/header')
	@UseGuards(JwtAuthGuard)
	async getUserHeader(@User() user: userParitalDto) {
		return await this.userService.getUserHeader(user.id);
	}

	@Post('/editProfile')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar', uploadConfig))
	async editProfile(@User() user: userParitalDto, @UploadedFile() avatar: Express.Multer.File, @Body('fullname') fullname: string, @Body('isDefault') isDefault: string) {
		if (isDefault === 'false')
			avatar = undefined;
		return await this.userService.editProfile(user.id, fullname, avatar?.filename);
	}
}
