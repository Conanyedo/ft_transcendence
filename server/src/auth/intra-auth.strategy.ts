import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, verify, Strategy } from "passport-42";
import { createUserDto } from "src/user/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
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
		console.log('dkhl l validate');
		
		const { id, username, displayName, emails, photos } = profile;
		const user: createUserDto = {
			id: id,
			login: username,
			fullname: displayName,
			email: emails[0].value,
			avatar: photos[0].value,
		};
		this.authService.checkUserExist(user);
		done(null, user);
	}
}