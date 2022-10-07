import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { loginValidate } from 'src/friendship/friendship.dto';
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
	async getUserMatches(@Param() data: loginValidate) {
		return await this.gameService.getMatches(data.login);
	}

}
