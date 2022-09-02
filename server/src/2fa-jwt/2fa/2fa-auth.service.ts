import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { userDto, userParitalDto } from 'src/user/user.dto';

@Injectable()
export class Jwt2faAuthService {
	constructor(
		private jwtService: JwtService,
		private readonly configService: ConfigService
	) { }

	set2faJwt(user: userParitalDto) {
		return this.jwtService.sign(user);
	}
}