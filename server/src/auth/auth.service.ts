import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
import { userDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {

	constructor(
		private readonly userService: UserService,
		private readonly jwtAuthService: JwtAuthService,
	) { }

	async checkUserExist(user: userDto): Promise<userDto> {
		let getUser = await this.userService.getUserByEmail(user.email);
		if (!getUser)
			getUser = await this.userService.registerUser(user);
		return { ...getUser };
	}

	setJWTCookie(user: userDto, res: Response) {
		const accessToken = this.jwtAuthService.login(user);
		res.cookie('jwt', accessToken);
	}

	checkUserAuthentication(user: userDto, res: Response) {
		if (user.is2faEnabled)
			return res.redirect('http://localhost:3000/?_2fa=true');
		res.redirect('http://localhost:3000/');
		this.userService.setUserAuthenticated(user.id, true);
	}

	async authenticateUser(user: userDto) {
		this.userService.setUserAuthenticated(user.id, true);
	}

	logout(user: userDto, res: Response) {
		this.userService.setUserAuthenticated(user.id, false);
		res.cookie('jwt', '', { maxAge: 1 });
	}


	// 2FactorAuthentication

	async generate2fa(user: userDto) {
		const secret = authenticator.generateSecret();
		this.userService.set2faSecret(user.id, secret);
		const otpAuthUrl = authenticator.keyuri(user.email, 'Transcendence', secret);
		const qrCode = await toDataURL(otpAuthUrl);
		return qrCode;
	}

	async turn2fa(user: userDto, status: boolean) {
		this.userService.turn2fa(user.id, status);
	}

	is2faCodeValid(code: string, secret: string) {
		const isValid = authenticator.verify({ token: code, secret: secret });
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		return true;
	}
}
