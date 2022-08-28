import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/user/user.dto';

@Injectable()
export class JwtAuthService {
	constructor(private jwtService: JwtService) { }

	login(user: userDto) {
		const payload = { login: user.login, sub: user.id };
		return this.jwtService.sign(payload);
	}
}