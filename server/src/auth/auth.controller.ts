import { Controller, Get, Post, Req, Res, UseGuards, Header } from '@nestjs/common';
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

	@Get('/login')
	@UseGuards(IntraAuthGuard)
	async login(@Req() req, @Res() res: Response) {
		await this.authService.checkUserAuthenticated(req.user, res);
		return res;
	}

	@Get('/2fa')
	@UseGuards(JwtAuthGuard)
	async twoFactorAuth(@Req() req, @Res() res: Response) {
		const otpAuthUrl = await this.authService.generate2faSecret(req.user);
		const qrCode = await this.authService.generateQrCodeDataURL(otpAuthUrl);
		console.log(qrCode);
		return qrCode;
	}

	@UseGuards(GoogleOauthGuard)
	@Get('/google/login')
	googleLogin(@Req() req, @Res() res: Response) {
		const accessToken = this.authService.setToken(req.user)
		res.cookie('jwt', accessToken);
		return res.redirect('http://localhost:3000/');
	}

	@Get('/is2faEnabled')
	@UseGuards(JwtAuthGuard)
	authorized(@Req() req) {
		console.log('dkhl ta hna');
		console.log(req.user);
		return this.authService.is2faEnabled(req.user);
	}

	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	logout(@Req() req, @Res() res: Response) {
		console.log('mchaa');
		this.logout(req.user, res);
		return res;
	}
}
