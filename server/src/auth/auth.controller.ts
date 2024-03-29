import { Controller, Get, Post, Res, UseGuards, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { IntraAuthGuard } from './intra-auth.guard';
import { GoogleOauthGuard } from './google-oauth.guard';
import { JwtAuthGuard } from '../2fa-jwt/jwt/jwt-auth.guard';
import { Jwt2faAuthGuard } from 'src/2fa-jwt/2fa/2fa-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { codeValidate, is2faEnabledValidate } from './auth.dto';
import { HttpExceptionFilter } from './exception.filter';


@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) { }

	@Get('/login')
	@UseGuards(IntraAuthGuard)
	@UseFilters(HttpExceptionFilter)
	async login(@User() user: userParitalDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.authenticateUser(user, res);
	}

	@Get('/google/login')
	@UseGuards(GoogleOauthGuard)
	@UseFilters(HttpExceptionFilter)
	async googleLogin(@User() user: userParitalDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.authenticateUser(user, res);
	}

	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	logout(@User() user: userParitalDto, @Res({ passthrough: true }) res: Response) {
		res.clearCookie('jwt', { httpOnly: true });
		return { data: true };
	}

	@Get('/isAuthorized')
	@UseGuards(JwtAuthGuard)
	isAuthorized() {
		return { data: true };
	}

	@Get('/is2faAuthorized')
	@UseGuards(Jwt2faAuthGuard)
	is2faAuthorized() {
		return { data: true };
	}

	@Get('/is2faEnabled')
	@UseGuards(JwtAuthGuard)
	async is2faEnabled(@User() user: userParitalDto) {
		return await this.authService.is2faEnabled(user);
	}

	@Post('/2faEnabling')
	@UseGuards(JwtAuthGuard)
	async enabling2fa(@User() user: userParitalDto, @Body() data: is2faEnabledValidate) {
		if (data.is2faEnabled === 'true')
			return await this.authService.generate2fa(user);
		this.authService.set2faEnabled(user, false);
		return { data: true };
	}

	@Post('/2faValidate')
	@UseGuards(JwtAuthGuard)
	async validate2faCode(@User() user: userParitalDto, @Body() data: codeValidate) {
		const isValid = await this.authService.is2faCodeValid(user, data.code);
		if (isValid.err)
			return isValid;
		await this.authService.set2faEnabled(user, true);
		return { data: true };
	}

	@Get('/2faRedirect')
	@UseGuards(JwtAuthGuard)
	redirect2fa(@Res({ passthrough: true }) res: Response) {
		this.authService.redirectProfile(res);
	}

	@Post('/2faLogin')
	@UseGuards(Jwt2faAuthGuard)
	async login2faCode(@User() user: userParitalDto, @Body() data: codeValidate, @Res({ passthrough: true }) res: Response) {
		const isValid = await this.authService.is2faCodeValid(user, data.code);
		if (isValid.err)
			return isValid;
		this.authService.setJWTCookie(user, res);
		return { data: true };
	}

}
