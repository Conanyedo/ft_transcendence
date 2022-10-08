import { WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { userStatus } from './user/user.entity';
import { JwtAuthService } from './2fa-jwt/jwt/jwt-auth.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('AppGateway');

	constructor(
		private jwtService: JwtAuthService,
		private userService: UserService
	) { }

	afterInit(server: any) {
		this.logger.log('App Gateway initialized!');
	}

	async handleConnection(client: Socket) {
		const token = client.handshake.headers.authorization.split(' ')[1];
		try {
			const payload = this.jwtService.verify(token);
			client.data.login = payload.login;
			this.userService.setStatus(payload.login, userStatus.ONLINE);
		}
		catch (e) {
			client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		this.userService.setStatus(client.data.login, userStatus.OFFLINE);
		client.disconnect();
	}
}
