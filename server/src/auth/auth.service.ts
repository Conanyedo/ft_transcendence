import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class AuthService {

	constructor(
		private readonly jwtService: JwtService
	) { }

	generateToken(user: createUserDto) {		
		const payload = { name: user.login, sub: user.id };
		return { access_token: this.jwtService.sign(payload) }
	}
}
