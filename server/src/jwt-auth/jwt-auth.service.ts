import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class JwtAuthService {
	constructor(private jwtService: JwtService) { }

	login(user: createUserDto) {
		const payload = { login: user.login, sub: user.id };
		return this.jwtService.sign(payload);
	}
}