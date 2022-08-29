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
	async login(@Req() req, @Res() res: Response) {
		this.authService.setJWTCookie(req.user, res);
		await this.authService.checkUserAuthentication(req.user, res);
		return res;
	}

	@UseGuards(GoogleOauthGuard)
	@Get('/google/login')
	async googleLogin(@Req() req, @Res() res: Response) {
		this.authService.setJWTCookie(req.user, res);
		await this.authService.checkUserAuthentication(req.user, res);
		return res;
	}
	// +++++++++++++++++++++++++++++++++++

	// Logout
	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	logout(@Req() req, @Res({ passthrough: true }) res: Response) {
		console.log('mchaa');
		this.authService.logout(req.user, res);
		return true;
	}
	// +++++++++++++++++++++++++++++++++++

	// isAuthorized
	@Get('/isAuthenticated')
	@UseGuards(JwtAuthGuard)
	isAuthenticated(@Req() req) {
		return req.user.isAuthenticated;
	}
	// +++++++++++++++++++++++++++++++++++

	// TwoFactorAuthentication
	@Get('/2fa')
	@UseGuards(JwtAuthGuard)
	async getTwoFactorAuthCode(@Req() req) {
		const otpAuthUrl = await this.authService.generate2faSecret(req.user);
		const qrCode = await this.authService.generateQrCodeDataURL(otpAuthUrl);
		return qrCode;
	}

	@Post('/2fa')
	@UseGuards(JwtAuthGuard)
	async checkTwoFactorAuthCode(@Req() req) {
		const code = req.body.code;
		const isValid = this.authService.is2faCodeValid(code, req.user);
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.authService.authenticateUser(req.user);
		return true;
	}
	// +++++++++++++++++++++++++++++++++++

	// isAuthorized
	@Get('/is2faEnabled')
	@UseGuards(JwtAuthGuard)
	is2faEnabled(@Req() req) {
		return req.user.is2faEnabled;
	}
	// +++++++++++++++++++++++++++++++++++
}
