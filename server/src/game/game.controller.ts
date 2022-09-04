import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) { }
	
	@Get('/')
	@UseGuards(JwtAuthGuard)
	async getMatches(@User() user: userParitalDto) {
		return ;
	}
}
