import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
import { createUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

	constructor(
		private readonly userService: UserService,
		private readonly jwtAuthService: JwtAuthService,
	) { }

	async checkUserExist(user: createUserDto) {
		let getUser = await this.userService.getUserById(user.id);
		if (!getUser)
			getUser = await this.userService.doUserRegistration(user);
	}

	setToken(req: Request) {
		const accessToken = this.jwtAuthService.login(<createUserDto>req.user);
		return accessToken;
	}
}
