import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, verify, Strategy } from "passport-42";
import { userDto, userParitalDto } from "src/user/user.dto";
import { AuthService } from "./auth.service";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {
		super({
			// Put config in `.env`
			clientID: configService.get('INTRA_CLIENT_ID'),
			clientSecret: configService.get('INTRA_CLIENT_SECRET'),
			callbackURL: configService.get('INTRA_REDIRECT_URL'),
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, done: verify): Promise<any> {

		const { username, displayName, emails, photos } = profile;
		const newUser: userDto = {
			login: username,
			fullname: displayName,
			avatar: photos[0].value,
		};
		const user: userParitalDto = await this.authService.checkUserExist(newUser);
		done(null, user);
	}
}