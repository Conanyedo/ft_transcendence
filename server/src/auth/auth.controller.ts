import { Controller, Get, Post, Req, Res, UseGuards, Header, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { IntraAuthGuard } from './intra-auth.guard';
import { GoogleOauthGuard } from './google-oauth.guard';
import { JwtAuthGuard } from '../2fa-jwt/jwt/jwt-auth.guard';
import { Jwt2faAuthGuard } from 'src/2fa-jwt/2fa/2fa-auth.guard';
import { User } from 'src/user/user.decorator';
import { userDto, userParitalDto } from 'src/user/user.dto';


@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) { }

	// Login
	@Get('/login')
	@UseGuards(IntraAuthGuard)
	async login(@User() user: userParitalDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.authenticateUser(user, res);
	}

	@UseGuards(GoogleOauthGuard)
	@Get('/google/login')
	async googleLogin(@User() user: userParitalDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.authenticateUser(user, res);
	}
	// +++++++++++++++++++++++++++++++++++

	// Logout
	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	logout(@User() user: userParitalDto, @Res({ passthrough: true }) res: Response) {
		this.authService.logout(user, res);
		return { data: true };
	}
	// +++++++++++++++++++++++++++++++++++

	// isAuthorized
	@Get('/isAuthorized')
	@UseGuards(JwtAuthGuard)
	async isAuthorized(@User() user: userParitalDto) {
		return await this.authService.isAuthorized(user);
	}
	// +++++++++++++++++++++++++++++++++++

	// is2faAuthorized
	@Get('/is2faAuthorized')
	@UseGuards(Jwt2faAuthGuard)
	is2faAuthorized() {
		return { data: true };
	}
	// +++++++++++++++++++++++++++++++++++

	// is2faEnabled
	@Get('/is2faEnabled')
	@UseGuards(JwtAuthGuard)
	async is2faEnabled(@User() user: userParitalDto) {
		return await this.authService.is2faEnabled(user);
	}
	// +++++++++++++++++++++++++++++++++++

	// TwoFactorAuthentication
	@Post('/2faEnabling')
	@UseGuards(JwtAuthGuard)
	async enabling2fa(@User() user: userParitalDto, @Body("is2faEnabled") is2faEnabled: string) {
		if (is2faEnabled === 'true')
			return await this.authService.generate2fa(user);
		this.authService.set2faEnabled(user, false);
		return { data: true };
	}

	@Post('/2faValidate')
	@UseGuards(JwtAuthGuard)
	async validate2faCode(@User() user: userParitalDto, @Body("code") code: string) {
		const isValid = await this.authService.is2faCodeValid(user, code);
		if (isValid.err)
			return isValid;
		this.authService.set2faEnabled(user, true);
		return { data: true };
	}

	@Post('/2faLogin')
	@UseGuards(Jwt2faAuthGuard)
	async login2faCode(@User() user: userParitalDto, @Body("code") code: string, @Res({ passthrough: true }) res: Response) {
		const isValid = await this.authService.is2faCodeValid(user, code);
		if (isValid.err)
			return isValid;
		this.authService.setJWTCookie(user, res);
		this.authService.setUserAuthenticated(user);
		return { data: true };
	}
	// +++++++++++++++++++++++++++++++++++
}
