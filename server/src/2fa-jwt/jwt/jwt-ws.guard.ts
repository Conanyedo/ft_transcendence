import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtAuthService } from './jwt-auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
	private logger: Logger = new Logger(WsJwtGuard.name);
	constructor(
		private jwtService: JwtAuthService
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {	
		try {
			const client: Socket = context.switchToWs().getClient<Socket>();
			let token: string = client.handshake?.headers?.authorization;
			token = token.split(' ')[1];
			const payload = this.jwtService.verify(token);
			context.switchToHttp().getRequest().user = { id: payload.id, login: payload.login };
			context.switchToWs();
			return true;
		} catch (err) {
			throw new WsException(err.message);
		}
	}
}