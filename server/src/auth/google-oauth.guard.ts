import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
	constructor(
		private readonly configService: ConfigService
	) {
		super()
	}

	handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
		if (err && !user) {
			const ctx = context.switchToHttp();
			const response = ctx.getResponse();
			response.redirect(`http://${this.configService.get('CLIENT_IP')}`)
			return response.status(HttpStatus.UNAUTHORIZED).send();
		}
		return user;
	}
}