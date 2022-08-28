import { Injectable } from '@nestjs/common';
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

	async checkUserAuthentication(user: userDto, res: Response) {
		if (user.is2faEnabled)
			return res.redirect('http://localhost:3000/?_2fa=true');
		res.redirect('http://localhost:3000/');
		await this.userService.setUserAuthenticated(user.id, true);
	}

	async logout(user: userDto, res: Response) {
		res.cookie('jwt', '', { maxAge: 1 });
		res.redirect('http://localhost:3000/');
		const getUser = await this.userService.setUserAuthenticated(user.id, false);
		console.log('Logout', getUser);
	}


	// 2FactorAuthentication

	async generate2faSecret(user: userDto) {
		const secret = authenticator.generateSecret();
		console.log('2fa Secret:', secret);
		const otpAuthUrl = authenticator.keyuri(
			user.email,
			'Transcendence',
			secret,
		);
		await this.userService.set2faSecret(user.id, secret);
		return otpAuthUrl;
	}

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return await toDataURL(otpAuthUrl);
	}

	is2faCodeValid(code: string, user: userDto) {
    return authenticator.verify({
      token: code,
      secret: user._2faSecret,
    });
  }

	async authenticateUser(user: userDto) {
		let getUser = await this.userService.getUserById(user.id);
		getUser = await this.userService.setUserAuthenticated(getUser.id, true);
		return { ...getUser };
	}
}
