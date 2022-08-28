import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserService } from "src/user/user.service";
import { userDto } from "src/user/user.dto";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET_KEY'),
		});
	}

	async validate(payload: any) {
		const getUser = await this.userService.getUserById(payload.sub);
		const user: userDto = { ...getUser };
		return user;
	}
}