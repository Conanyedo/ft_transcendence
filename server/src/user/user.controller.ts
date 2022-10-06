import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { updateProfileValidate, userParitalDto } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../2fa-jwt/jwt/jwt-auth.guard';
import { User } from './user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadUsersConfig } from 'src/config/upload.config';
import { loginValidate } from 'src/friendship/friendship.dto';

@Controller('user')
export class UserController {

	constructor(private readonly userService: UserService) { }

	@Post('/editProfile')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar', uploadUsersConfig))
	async editProfile(@User() user: userParitalDto, @UploadedFile() avatar: Express.Multer.File, @Body() data: updateProfileValidate) {
		return await this.userService.editProfile(user.id, data.fullname, avatar?.filename, data.oldPath);
	}

	@Post('/isExist')
	@UseGuards(JwtAuthGuard)
	async userExist(@User() user: userParitalDto, @Body() data: loginValidate) {
		return await this.userService.userExist(user.login, data.login);
	}

	@Get('/header')
	@UseGuards(JwtAuthGuard)
	async getMyHeader(@User() user: userParitalDto) {
		return await this.userService.getUserHeader(user.login);
	}

	@Get('/header/:login')
	@UseGuards(JwtAuthGuard)
	async getUserHeader(@Param() data: loginValidate) {
		return await this.userService.getUserHeader(data.login);
	}

	@Get('/info')
	@UseGuards(JwtAuthGuard)
	async getMyInfo(@User() user: userParitalDto) {
		return await this.userService.getUserInfo(user.login, user.login);
	}

	@Get('/info/:login')
	@UseGuards(JwtAuthGuard)
	async getUserInfo(@User() user: userParitalDto, @Param() data: loginValidate) {
		return await this.userService.getUserInfo(user.login, data.login);
	}

	@Get('/stats')
	@UseGuards(JwtAuthGuard)
	async getMyStats(@User() user: userParitalDto) {
		return await this.userService.getUserStats(user.id, 'id');
	}

	@Get('/stats/:login')
	@UseGuards(JwtAuthGuard)
	async getUserStats(@Param() data: loginValidate) {
		return await this.userService.getUserStats(data.login, 'login');
	}

	@Get('/achievements')
	@UseGuards(JwtAuthGuard)
	async getMyAchievements(@User() user: userParitalDto) {
		return await this.userService.getAchievements(user.id, 'id');
	}

	@Get('/achievements/:login')
	@UseGuards(JwtAuthGuard)
	async getAchievements(@Param() data: loginValidate) {
		return await this.userService.getAchievements(data.login, 'login');
	}

	@Get('/leaderborad')
	@UseGuards(JwtAuthGuard)
	async leaderBoard(@User() user: userParitalDto) {
		return await this.userService.getLeaderBoard(user.login);
	}

}
