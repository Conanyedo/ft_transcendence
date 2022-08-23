import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { verify, Strategy } from "passport-42";
import { createUserDto } from "src/user/dto/createUser.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
		private readonly userService: UserService
	) {
		super({
			clientID: '55cb6d2cbb71ecd8e967dbf1748aa17ebd1945310b0a5945cb8169854f2c9f31',
			clientSecret: '17980cf7bff025385ad85215c885af4fa5e7931d7ba56e0c0d2c0b13d4e93aa9',
			callbackURL: 'http://localhost:3000/auth/profile',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: verify): Promise<any> {

		// console.log(accessToken);
		// console.log(refreshToken);
		console.log(profile);

		const { id, username, displayName, emails, photos } = profile;
		const user: createUserDto = {
			id: id,
			login: username,
			fullname: displayName,
			email: emails[0].value,
			avatar: photos[0].value,
		};
		console.log(user);

		let getUser = await this.userService.getUserById(user.id);
		console.log(getUser);
		
		if (!getUser) {
			console.log('user not in database');
			getUser = await this.userService.doUserRegistration(user);
		}
		done(null, user);
	}
}