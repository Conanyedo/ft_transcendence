import { INestApplicationContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions, Socket } from "socket.io";
import { JwtAuthService } from "./2fa-jwt/jwt/jwt-auth.service";

export class SocketIOAdapter extends IoAdapter {

	private readonly logger = new Logger(SocketIOAdapter.name);

	constructor(
		private app: INestApplicationContext,
		private configService: ConfigService,

	) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions) {
		const clientIP = this.configService.get<string>('CLIENT_IP');

		options.cors = { origin: `http://${clientIP}` };

		const jwtAuthService = this.app.get(JwtAuthService);

		const server = super.createIOServer(port, options);
		server.use(verifyTokenMiddleware(jwtAuthService, this.logger))
		return server;
	}
}


const verifyTokenMiddleware =
	(jwtAuthService: JwtAuthService, logger: Logger) =>
		(socket: Socket, next) => {

			const token = socket.handshake.auth.token || socket.handshake.headers.authorization.split(' ')[1];

			try {
				const payload = jwtAuthService.verify(token);
				// logger.debug(`Connected to the server : ${payload.login}`);
				socket.data.login = payload.login;
				next();
			} catch {
				// logger.debug('Disconnected due to invalid token!!');
			}
		};