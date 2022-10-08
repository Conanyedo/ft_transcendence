import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { userStatus } from './user/user.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  constructor(
    private userService: UserService,
  ) {}

  afterInit(server: any) {
    this.logger.log('App Gateway initialized!');
  }

  async handleConnection(client: Socket) {
    this.userService.setStatus(client.data.login, userStatus.ONLINE);
  }

  async handleDisconnect(client: Socket) {
    this.userService.setStatus(client.data.login, userStatus.OFFLINE);
    client.disconnect();
  }
}
