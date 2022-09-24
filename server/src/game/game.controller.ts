import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) { }
	
	@Get('/matchHistory')
	@UseGuards(JwtAuthGuard)
	async getMyMatches(@User() user: userParitalDto) {
		return await this.gameService.getMatches(user.login);
	}
	
	@Get('/matchHistory/:login')
	@UseGuards(JwtAuthGuard)
	async getUserMatches(@Param('login') login: string) {
		return await this.gameService.getMatches(login);
	}

	@Get('/onlineFriends')
	@UseGuards(JwtAuthGuard)
	async getOnlineFriends(@User() user: userParitalDto) {
		return await this.gameService.getOnlineFriends(user.login);
	}
}
