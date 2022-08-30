import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
import { userDto, userParitalDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {

	constructor(
		private readonly userService: UserService,
		private readonly jwtAuthService: JwtAuthService,
	) { }

	// Check if User exist or add it to database
	async checkUserExist(user: userDto): Promise<userParitalDto> {
		let getUser: userParitalDto = await this.userService.getPartialUser(user.email);
		if (!getUser)
			getUser = await this.userService.registerUser(user);
		return getUser;
	}

	// Set Cookies
	async setJWTCookie(user: userParitalDto, res: Response) {
		const accessToken = await this.jwtAuthService.setJwt(user);
		res.cookie('jwt', accessToken);
		res.cookie('jwt-2fa', '', { maxAge: 1 });
	}
	async setJWT2faCookie(user: userParitalDto, res: Response) {
		const accessToken = await this.jwtAuthService.set2faJwt(user);
		res.cookie('jwt-2fa', accessToken);
	}
	// ----------------------

	// Authenticate User
	async authenticateUser(user: userParitalDto, res: Response) {
		const is2faEnabled = await this.userService.get2faEnabled(user.id);
		if (is2faEnabled) {
			await this.setJWT2faCookie(user, res);
			return res.redirect('http://localhost:3000/?_2fa=true');
		}
		await this.setJWTCookie(user, res);
		res.redirect('http://localhost:3000/');
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
