import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from 'src/2fa-jwt/jwt/jwt-auth.service';
import { userDto, userParitalDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Jwt2faAuthService } from 'src/2fa-jwt/2fa/2fa-auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

	constructor(
		private readonly userService: UserService,
		private readonly jwtAuthService: JwtAuthService,
		private readonly jwt2faAuthService: Jwt2faAuthService,
		private readonly configService: ConfigService
	) { }

	// Check if User exist or add it to database
	async checkUserExist(user: userDto): Promise<userParitalDto> {
		let getUser: userParitalDto = await this.userService.getPartialUser(user.login);
		if (!getUser) {
			getUser = await this.userService.registerUser(user);
			return { ...getUser }
		}
		return { ...getUser };
	}

	// Set Cookies
	setJWTCookie(user: userParitalDto, res: Response) {
		const accessToken = this.jwtAuthService.setJwt(user);
		res.cookie('jwt', accessToken);
		res.cookie('jwt-2fa', '', { maxAge: 1 });
	}
	setJWT2faCookie(user: userParitalDto, res: Response) {
		const accessToken = this.jwt2faAuthService.set2faJwt(user);
		res.cookie('jwt-2fa', accessToken);
	}
	// ----------------------

	// Authenticate User
	async authenticateUser(user: userParitalDto, res: Response) {
		const is2faEnabled = await this.userService.get2faEnabled(user.id);
		if (is2faEnabled) {
			this.setJWT2faCookie(user, res);
			return res.redirect(`http://${this.configService.get('CLIENT_IP')}/?_2fa=true`);
		}
		this.setJWTCookie(user, res);
		if (user.isFirst)
			res.cookie('isFirst', true);
		res.redirect(`http://${this.configService.get('CLIENT_IP')}/`);
		this.userService.setUserAuthenticated(user.id, true);
	}
	async setUserAuthenticated(user: userParitalDto) {
		this.userService.setUserAuthenticated(user.id, true);
	}
	// ---------------------

	// Log User out
	logout(user: userParitalDto, res: Response) {
		this.userService.setUserAuthenticated(user.id, false);
		res.cookie('jwt', '', { maxAge: 1 });
	}
	// ---------------------

	// Log User out
	async isAuthorized(user: userParitalDto) {
		const isAuthorized = await this.userService.getIsAuthenticated(user.id);
		if (!isAuthorized)
			throw new UnauthorizedException('Unauthorized');
		return isAuthorized;
	}
	// ---------------------

	// 2FactorAuthentication
	async generate2fa(user: userParitalDto) {
		const secret = authenticator.generateSecret();
		this.userService.set2faSecret(user.id, secret);
		const otpAuthUrl = authenticator.keyuri(user.login, 'Transcendence', secret);
		const qrCode = await toDataURL(otpAuthUrl);
		return qrCode;
	}

	set2faEnabled(user: userParitalDto, status: boolean) {
		this.userService.set2faEnabled(user.id, status);
	}
	// ---------------------

	// Check if 2fa Code valid
	async is2faCodeValid(user: userParitalDto, code: string) {
		const secret = await this.userService.getSecret(user.id);
		const isValid = authenticator.verify({ token: code, secret: secret });
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		return true;
	}
	// ---------------------

	async is2faEnabled(user: userParitalDto) {
		return await this.userService.get2faEnabled(user.id);
	}
}
