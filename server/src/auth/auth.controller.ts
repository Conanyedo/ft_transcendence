import { Controller, Get, Post, Req, Res, UseGuards, Header, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './intra-auth.guard';
import { GoogleOauthGuard } from './google-oauth.guard';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { Response } from 'express';
import { User } from 'src/user/user.decorator';
import { userDto } from 'src/user/user.dto';


@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) { }

	// Login
	@Get('/login')
	@UseGuards(IntraAuthGuard)
	login(@User() user: userDto, @Res() res: Response) {
		this.authService.setJWTCookie(user, res);
		this.authService.authenticateUser(user, res);
		return res;
	}

	@UseGuards(GoogleOauthGuard)
	@Get('/google/login')
	googleLogin(@User() user: userDto, @Res() res: Response) {
		this.authService.setJWTCookie(user, res);
		this.authService.authenticateUser(user, res);
		return res;
	}
	// +++++++++++++++++++++++++++++++++++

	// Logout
	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	logout(@User() user: userDto, @Res({ passthrough: true }) res: Response) {
		this.authService.logout(user, res);
		return true;
	}
	// +++++++++++++++++++++++++++++++++++

	// isAuthenticated
	@Get('/isAuthenticated')
	@UseGuards(JwtAuthGuard)
	isAuthenticated(@User() user: any) {
		// if (!user.isAuthenticated)
		// 	throw new UnauthorizedException('UnAuthenticated');
		return user.isAuthenticated;
	}
	// +++++++++++++++++++++++++++++++++++

	// TwoFactorAuthentication
	@Post('/2faEnabling')
	@UseGuards(JwtAuthGuard)
	async enabling2fa(@User() user: userDto, @Body("is2faEnabled") is2faEnabled: string) {
		if (is2faEnabled === 'true')
			return await this.authService.generate2fa(user);
		this.authService.turn2fa(user, false);
		return true;
	}

	@Post('/2faValidate')
	@UseGuards(JwtAuthGuard)
	validate2faCode(@User() user: userDto, @Body("code") code: string) {
		this.authService.is2faCodeValid(code, user._2faSecret);
		this.authService.turn2fa(user, true);
		return true;
	}

	@Post('/2faLogin')
	@UseGuards(JwtAuthGuard)
	async login2faCode(@User() user: userDto, @Body("code") code: string) {
		this.authService.is2faCodeValid(code, user._2faSecret);
		this.authService.setUserAuthenticated(user);
		return true;
	}
	// +++++++++++++++++++++++++++++++++++

	// is2faEnabled
	@Get('/is2faEnabled')
	@UseGuards(JwtAuthGuard)
	is2faEnabled(@User() user: userDto) {
		return user.is2faEnabled;
	}
	// +++++++++++++++++++++++++++++++++++
}
