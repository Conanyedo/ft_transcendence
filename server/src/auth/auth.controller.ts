import { Controller, Get, Post, Req, Res, UseGuards, Header, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './intra-auth.guard';
import { GoogleOauthGuard } from './google-oauth.guard';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) { }

	// Login
	@Get('/login')
	@UseGuards(IntraAuthGuard)
	login(@Req() req, @Res() res: Response) {
		this.authService.setJWTCookie(req.user, res);
		this.authService.checkUserAuthentication(req.user, res);
		return res;
	}

	@UseGuards(GoogleOauthGuard)
	@Get('/google/login')
	googleLogin(@Req() req, @Res() res: Response) {
		this.authService.setJWTCookie(req.user, res);
		this.authService.checkUserAuthentication(req.user, res);
		return res;
	}
	// +++++++++++++++++++++++++++++++++++

	// Logout
	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	logout(@Req() req, @Res({ passthrough: true }) res: Response) {
		this.authService.logout(req.user, res);
		return true;
	}
	// +++++++++++++++++++++++++++++++++++

	// isAuthenticated
	@Get('/isAuthenticated')
	@UseGuards(JwtAuthGuard)
	isAuthenticated(@Req() req) {
		if (!req.user.isAuthenticated)
			throw new UnauthorizedException('UnAuthenticated');
		return req.user.isAuthenticated;
	}
	// +++++++++++++++++++++++++++++++++++

	// TwoFactorAuthentication
	@Post('/2faEnabling')
	@UseGuards(JwtAuthGuard)
	async enabling2fa(@Req() req) {
		if (req.body.is2faEnabled === 'true')
			return await this.authService.generate2fa(req.user);
		this.authService.turn2fa(req.user, false);
		return true;
	}

	@Post('/2faValidate')
	@UseGuards(JwtAuthGuard)
	validate2faCode(@Req() req) {
		this.authService.is2faCodeValid(req.body.code, req.user._2faSecret);
		this.authService.turn2fa(req.user, true);
		return true;
	}

	@Post('/2faLogin')
	@UseGuards(JwtAuthGuard)
	async login2faCode(@Req() req) {
		this.authService.is2faCodeValid(req.body.code, req.user._2faSecret);
		this.authService.authenticateUser(req.user);
		return true;
	}
	// +++++++++++++++++++++++++++++++++++

	// is2faEnabled
	@Get('/is2faEnabled')
	@UseGuards(JwtAuthGuard)
	is2faEnabled(@Req() req) {
		return req.user.is2faEnabled;
	}
	// +++++++++++++++++++++++++++++++++++
}
