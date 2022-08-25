import { Controller, Get, Post, Req, Res, UseGuards, Header } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './intra-auth.guard';
import { GoogleOauthGuard } from './google-oauth.guard';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) { }

	@Get('auth/login')
	@UseGuards(IntraAuthGuard)
	login(@Req() req: Request, @Res() res: Response) {
		const accessToken = this.authService.setToken(req)
		res.cookie('jwt', accessToken);
		return res.redirect('http://localhost:3000/');
	}

	@UseGuards(GoogleOauthGuard)
	@Get('auth/google/login')
	googleLogin(@Req() req: Request, @Res() res: Response) {
		const accessToken = this.authService.setToken(req)
		res.cookie('jwt', accessToken);
		return res.redirect('http://localhost:3000/');
	}

	@Get('auth/isAuthorized')
	@UseGuards(JwtAuthGuard)
	authorized(@Req() req: Request) {
		console.log('tauthoriza');
		return req.user;
	}
}
