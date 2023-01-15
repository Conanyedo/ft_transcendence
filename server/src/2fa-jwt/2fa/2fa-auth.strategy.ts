import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { userParitalDto } from "src/user/user.dto";
import { Request } from "express";

@Injectable()
export class Jwt2faAuthStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([Jwt2faAuthStrategy.extractJwt]),
			ignoreExpiration: false,
			secretOrKey: configService.get('2FA_JWT_SECRET_KEY'),
		});
	}

	async validate(payload: userParitalDto) {
		const user: userParitalDto = { id: payload.id, login: payload.login };
		return user;
	}

	private static extractJwt(req: Request) {
		if (req.cookies && req.cookies['jwt-2fa'] && req.cookies['jwt-2fa'].length)
			return req.cookies['jwt-2fa'];
		return null;
	}
}