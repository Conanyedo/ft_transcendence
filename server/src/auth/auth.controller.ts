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
	logout(@Req() req, @Res() res: Response) {
		console.log('mchaa');
		this.logout(req.user, res);
		return res;
	}
	// +++++++++++++++++++++++++++++++++++

	// TwoFactorAuthentication
	@Get('/2fa')
	@UseGuards(JwtAuthGuard)
	async getTwoFactorAuthCode(@Req() req, @Res() res: Response) {
		const otpAuthUrl = await this.authService.generate2faSecret(req.user);
		const qrCode = await this.authService.generateQrCodeDataURL(otpAuthUrl);
		console.log(qrCode);
		return qrCode;
	}

	@Post('/2fa')
	@UseGuards(JwtAuthGuard)
	async checkTwoFactorAuthCode(@Req() req) {
		const code = req.body.code;
		const isValid = this.authService.is2faCodeValid(code, req.user);
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		return await this.authService.authenticateUser(req.user);
	}
	// +++++++++++++++++++++++++++++++++++
}
