import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
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

	async checkUserExist(user: userDto): Promise<userParitalDto> {
		let getUser: userParitalDto = await this.userService.getPartialUser(user.login);
		if (!getUser)
			getUser = await this.userService.registerUser(user);
		return { ...getUser };
	}

	redirectProfile(res: Response) {
		res.redirect(`http://${this.configService.get('CLIENT_IP')}/profile`);
	}

	setJWTCookie(user: userParitalDto, res: Response) {
		const accessToken: string = this.jwtAuthService.setJwt(user);
		res.cookie('jwt', accessToken, { httpOnly: true });
		res.clearCookie('jwt-2fa', { httpOnly: true });
	}

	setJWT2faCookie(user: userParitalDto, res: Response) {
		const accessToken: string = this.jwt2faAuthService.set2faJwt(user);
		res.cookie('jwt-2fa', accessToken, { httpOnly: true });
	}

	async authenticateUser(user: userParitalDto, res: Response) {
		if (user.isFirst)
			res.cookie('isFirst', true);
		user = { login: user.login, id: user.id };
		const is2faEnabled: boolean = await this.userService.get2faEnabled(user.id);
		if (is2faEnabled) {
			this.setJWT2faCookie(user, res);
			return res.redirect(`http://${this.configService.get('CLIENT_IP')}/?_2fa=true`);
		}
		this.setJWTCookie(user, res);
		this.redirectProfile(res);
	}

	async generate2fa(user: userParitalDto) {
		const secret: string = authenticator.generateSecret();
		this.userService.set2faSecret(user.id, secret);
		const otpAuthUrl: string = authenticator.keyuri(user.login, 'Transcendence', secret);
		const qrCode: string = await toDataURL(otpAuthUrl);
		return { data: qrCode };
	}

	async set2faEnabled(user: userParitalDto, status: boolean) {
		await this.userService.set2faEnabled(user.id, status);
		if (!status) await this.userService.set2faSecret(user.id, null);
		return true;
	}

	async is2faCodeValid(user: userParitalDto, code: string) {
		const secret = await this.userService.getSecret(user.id);
		const isValid = authenticator.verify({ token: code, secret: secret });
		if (!isValid)
			return { err: 'Wrong authentication code' };
		return { data: true };
	}

	async is2faEnabled(user: userParitalDto) {
		const is2faEnabled: boolean = await this.userService.get2faEnabled(user.id);
		return { data: is2faEnabled };
	}
}
