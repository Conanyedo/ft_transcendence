import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { userDto, userParitalDto } from 'src/user/user.dto';

@Injectable()
export class JwtAuthService {
	constructor(
		private jwtService: JwtService,
		private readonly configService: ConfigService
	) { }

	async setJwt(user: userParitalDto) {
		return await this.jwtService.signAsync(user, {
			secret: this.configService.get('JWT_SECRET_KEY'),
			expiresIn: '1d'
		});
	}

	async set2faJwt(user: userParitalDto) {
		return await this.jwtService.signAsync(user, {
			secret: this.configService.get('2FA_JWT_SECRET_KEY'),
			expiresIn: '1d'
		});
	}
}