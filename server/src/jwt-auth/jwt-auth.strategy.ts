import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserService } from "src/user/user.service";
import { userDto, userParitalDto } from "src/user/user.dto";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET_KEY'),
		});
	}

	async validate(payload: userParitalDto) {
		const user: userParitalDto = { ...payload };
		return user;
	}
}