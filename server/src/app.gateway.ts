import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtAuthService } from './2fa-jwt/jwt/jwt-auth.service';
import { UserService } from './user/user.service';

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
		this.logger.log('Initialized!');
	}

	async handleConnection(client: Socket) {
		console.log('Connected /: ', client.id);
		const token = client.handshake.headers.authorization.split(' ')[1];
		try {
			const payload = this.jwtService.verify(token);
			client.data.login = payload.login;
			this.userService.setSocketId(payload.id, client.id);
		}
		catch (e) {
			client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		console.log('Disconneted /: ');
		const token = client.handshake.headers.authorization.split(' ')[1];
		try {
			const payload = this.jwtService.verify(token);
			this.userService.setSocketId(payload.id, null);
			client.disconnect();
		}
		catch (e) {
			client.disconnect();
		}
	}
}
