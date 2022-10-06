import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { loginValidate } from './friendship.dto';
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
	async addFriend(@User() user: userParitalDto, @Body() data: loginValidate) {
		return await this.friendshipService.addFriend(user.login, data.login);
	}

	@Post('/unfriend')
	@UseGuards(JwtAuthGuard)
	async unfriend(@User() user: userParitalDto, @Body() data: loginValidate) {
		await this.friendshipService.unfriend(user.login, data.login);
		return { data: true };
	}

	@Post('/acceptRequest')
	@UseGuards(JwtAuthGuard)
	async acceptRequest(@User() user: userParitalDto, @Body() data: loginValidate) {
		const result = await this.friendshipService.acceptRequest(user.login, data.login);
		return { data: result };
	}

	@Post('/refuseRequest')
	@UseGuards(JwtAuthGuard)
	async refuseRequest(@User() user: userParitalDto, @Body() data: loginValidate) {
		const result = await this.friendshipService.refuseRequest(user.login, data.login);
		return { data: result };
	}

	@Post('/cancelRequest')
	@UseGuards(JwtAuthGuard)
	async cancelRequest(@User() user: userParitalDto, @Body() data: loginValidate) {
		const result = await this.friendshipService.cancelRequest(user.login, data.login);
		return { data: result };
	}

	@Post('/blockUser')
	@UseGuards(JwtAuthGuard)
	async blockUser(@User() user: userParitalDto, @Body() data: loginValidate) {
		const result = this.friendshipService.blockUser(user.login, data.login);
		return { data: result };
	}

	@Post('/unblock')
	@UseGuards(JwtAuthGuard)
	async unblock(@User() user: userParitalDto, @Body() data: loginValidate) {
		const result = this.friendshipService.unblock(user.login, data.login);
		return { data: result };
	}
}
