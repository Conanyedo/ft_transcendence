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
		// if (getUser)
		// 	getUser = await this.userService.setUserAuthenticated(getUser.id);
		// else
		if (!getUser)
			getUser = await this.userService.registerUser(user);
		return { ...getUser };
	}

	async checkUserAuthenticated(user: userDto, res: Response) {
		const accessToken = this.jwtAuthService.login(user);
		res.cookie('jwt', accessToken);

		let getUser = await this.userService.getUserById(user.id);
		if (!getUser.is2faEnabled)
		{
			console.log('Enabled', getUser);
			return res.redirect('http://localhost:3000/?_2fa=true');
		}
		res.redirect('http://localhost:3000/');
		getUser = await this.userService.setUserAuthenticated(getUser.id);
		console.log('unEnabled', getUser);
	}

	async logout(user: userDto, res: Response) {
		res.cookie('jwt', '', { maxAge: 1 });
		res.redirect('http://localhost:3000/');
		const getUser = await this.userService.unsetUserAuthenticated(user.id);
		console.log('logout', getUser);
		
	}

	setToken(user: userDto) {
		const accessToken = this.jwtAuthService.login(user);
		return accessToken;
	}

	is2faEnabled(user: userDto): boolean {
		return user.is2faEnabled === true;
	}

	async generate2faSecret(user: userDto) {
		const secret = authenticator.generateSecret();
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
}
