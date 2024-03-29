import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { userDto, userParitalDto } from 'src/user/user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {
		super({
			// Put config in `.env`
			clientID: configService.get('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
			callbackURL: configService.get('GOOGLE_REDIRECT_URL'),
			scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {

		const { displayName, emails } = profile;
		const newUser: userDto = {
			login: `${emails[0].value.split('@')[0]}G`,
			fullname: displayName,
			avatar: `https://ui-avatars.com/api/?name=${displayName}&size=220&background=2C2C2E&color=409CFF&length=1`
		};
		const user: userParitalDto = await this.authService.checkUserExist(newUser);
		done(null, user);
	}
}