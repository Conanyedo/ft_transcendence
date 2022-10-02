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

	@Get('/onlineFriends')
	@UseGuards(JwtAuthGuard)
	async getOnlineFriends(@User() user: userParitalDto) {
		return await this.friendshipService.getOnlineFriends(user.login);
	}

	@Get('/requests')
	@UseGuards(JwtAuthGuard)
	async getRequests(@User() user: userParitalDto) {
		return await this.friendshipService.getRequests(user.login);
	}

	@Get('/pending')
	@UseGuards(JwtAuthGuard)
	async getPending(@User() user: userParitalDto) {
		return await this.friendshipService.getPending(user.login);
	}

	@Get('/blocked')
	@UseGuards(JwtAuthGuard)
	async getBlocked(@User() user: userParitalDto) {
		return await this.friendshipService.getBlocked(user.login);
	}

	@Post('/addFriend')
	@UseGuards(JwtAuthGuard)
	async addFriend(@User() user: userParitalDto, @Body('login') friend: string) {
		return await this.friendshipService.addFriend(user.login, friend);
	}

	@Post('/unfriend')
	@UseGuards(JwtAuthGuard)
	unfriend(@User() user: userParitalDto, @Body('login') friend: string) {
		this.friendshipService.unfriend(user.login, friend);
		return { data: true };
	}

	@Post('/acceptRequest')
	@UseGuards(JwtAuthGuard)
	acceptRequest(@User() user: userParitalDto, @Body('login') friend: string) {
		this.friendshipService.acceptRequest(user.login, friend);
		return { data: true };
	}

	@Post('/refuseRequest')
	@UseGuards(JwtAuthGuard)
	refuseRequest(@User() user: userParitalDto, @Body('login') friend: string) {
		this.friendshipService.refuseRequest(user.login, friend);
		return { data: true };
	}

	@Post('/cancelRequest')
	@UseGuards(JwtAuthGuard)
	cancelRequest(@User() user: userParitalDto, @Body('login') friend: string) {
		this.friendshipService.cancelRequest(user.login, friend);
		return { data: true };
	}

	@Post('/blockUser')
	@UseGuards(JwtAuthGuard)
	blockUser(@User() user: userParitalDto, @Body('login') friend: string) {
		this.friendshipService.blockUser(user.login, friend);
		return { data: true };
	}

	@Post('/unblock')
	@UseGuards(JwtAuthGuard)
	unblock(@User() user: userParitalDto, @Body('login') friend: string) {
		this.friendshipService.unblock(user.login, friend);
		return { data: true };
	}
}
