import { Body, Controller, Get, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { userDto, userParitalDto } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../2fa-jwt/jwt/jwt-auth.guard';
import { User } from './user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadUsersConfig } from 'src/config/upload.config';

@Controller('user')
export class UserController {

	constructor(private readonly userService: UserService) { }
	
	@Post('/editProfile')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar', uploadUsersConfig))
	async editProfile(@User() user: userParitalDto, @UploadedFile() avatar: Express.Multer.File, @Body('fullname') fullname: string, @Body('oldPath') oldPath: string) {
		return await this.userService.editProfile(user.id, fullname, avatar?.filename, oldPath);
	}

	@Get('/header')
	@UseGuards(JwtAuthGuard)
	async getMyHeader(@User() user: userParitalDto) {
		return await this.userService.getUserHeader(user.id);
	}

	@Get('/info')
	@UseGuards(JwtAuthGuard)
	async getMyInfo(@User() user: userParitalDto) {
		return await this.userService.getUserInfo(user.login, user.login);
	}

	@Get('/info/:login')
	@UseGuards(JwtAuthGuard)
	async getUserInfo(@User() user: userParitalDto, @Param('login') login: string) {
		return await this.userService.getUserInfo(user.login, login);
	}

	@Get('/stats')
	@UseGuards(JwtAuthGuard)
	async getMyStats(@User() user: userParitalDto) {
		return await this.userService.getUserStats(user.id, 'id');
	}

	@Get('/stats/:login')
	@UseGuards(JwtAuthGuard)
	async getUserStats(@Param('login') login: string) {
		return await this.userService.getUserStats(login, 'login');
	}

	@Get('/achievements')
	@UseGuards(JwtAuthGuard)
	async getMyAchievements(@User() user: userParitalDto) {
		return await this.userService.getAchievements(user.id, 'id');
	}

	@Get('/achievements/:login')
	@UseGuards(JwtAuthGuard)
	async getAchievements(@Param('login') login: string) {
		return await this.userService.getAchievements(login, 'login');
	}

	@Get('/leaderborad')
	@UseGuards(JwtAuthGuard)
	async leaderBoard(@User() user: userParitalDto) {
		return await this.userService.getLeaderBoard(user.login);
	}

}
