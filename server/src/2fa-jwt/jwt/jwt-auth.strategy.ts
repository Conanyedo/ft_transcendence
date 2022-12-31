import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { userParitalDto } from "src/user/user.dto";
import { Request } from 'express';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(protected readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtAuthStrategy.extractJWT]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET_KEY'),
		});
	}

	async validate(payload: userParitalDto) {
		const user: userParitalDto = { id: payload.id, login: payload.login };
		return user;
	}

	private static extractJWT(req: Request) {
		if (req.cookies?.jwt && req.cookies.jwt.length)
			return req.cookies.jwt;
		return null;
	}
}