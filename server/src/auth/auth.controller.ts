import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './intra-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) { }

	@UseGuards(IntraAuthGuard)
	@Get('login')
	login() { }

	@UseGuards(IntraAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		console.log('mr7baaaa');
		return req.user;
	}
}
