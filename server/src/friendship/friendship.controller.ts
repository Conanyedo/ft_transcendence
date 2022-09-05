import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { userRelation } from './friendship.entity';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) { }

	@Get('/friends')
	@UseGuards(JwtAuthGuard)
	async getFriends(@User() user: userParitalDto) {
		return await this.friendshipService.getFriends(user.login);
	}

	@Get('/pendings')
	@UseGuards(JwtAuthGuard)
	async getPendings(@User() user: userParitalDto) {
		return await this.friendshipService.getPendings(user.login);
	}

	@Get('/blocked')
	@UseGuards(JwtAuthGuard)
	async getBlocked(@User() user: userParitalDto) {
		return await this.friendshipService.getBlocked(user.login);
	}

	@Post('/addFriend')
	@UseGuards(JwtAuthGuard)
	addFriend(@User() user: userParitalDto, @Body('login') friend: string) {
		this.friendshipService.addFriend(user.login, friend);
		return true;
	}

	@Post('/removeFriend')
	@UseGuards(JwtAuthGuard)
	removeFriend(@User() user: userParitalDto, @Body('login') friend: string, @Body('relation') relation: userRelation) {
		this.friendshipService.removeFriend(user.login, friend, relation);
		return true;
	}
}
