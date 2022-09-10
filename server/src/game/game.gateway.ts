import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Game, Lobby } from './classes/Game';
import { Player } from './classes/Player';

@WebSocketGateway(5551, { cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  users: Lobby[] = [];
  games: Game[] = [];
  handleConnection(client: Socket, ...args: any[]) {
    console.log('connection: ', client.id);
    // client.disconnect();
  }
  handleDisconnect(client: Socket) {
    console.log('Desconnect: ', client.id);
    this.games.find((game) => {
      if (
        game._PlayerLeft.socket === client ||
        game._PlayerRight.socket === client
      )
        this.games.splice(this.games.indexOf(game), 1);
    });
    this.users = this.users.filter((user) => user.client !== client);
    client.disconnect();
  }
  @SubscribeMessage('joinGame')
  handleEventJoinGame(client: Socket, data: any): void {
	this.users.push(new Lobby(data.login, '', client))
    if (this.users.length > 1) {
      const player = new Player(this.users[0].login, this.users[0].client, 'left');
      const playertwo = new Player(this.users[1].login, this.users[1].client, 'right');
      const newGame = new Game(player, playertwo);
      this.games.push(newGame);
      this.users.splice(0, 2);
    }
  }
  @SubscribeMessage('go_Up')
  handlechangePaddleUp(client: Socket, data: any): void {
    this.games.find((game) => {
      if (game._PlayerLeft.socket === client)
        game._PlayerLeft.paddle.isUP = true;
      else if (game._PlayerRight.socket === client)
        game._PlayerRight.paddle.isUP = true;
    });
  }
  @SubscribeMessage('go_Down')
  handlechangePaddleDown(client: Socket, data: any): void {
    this.games.find((game) => {
      if (game._PlayerLeft.socket === client)
        game._PlayerLeft.paddle.isDown = true;
      else if (game._PlayerRight.socket === client) {
        game._PlayerRight.paddle.isDown = true;
      }
    });
  }
  @SubscribeMessage('stop')
  handlestopPaddle(client: Socket, data: any): void {
    this.games.find((game) => {
      if (game._PlayerLeft.socket === client) {
        game._PlayerLeft.paddle.isDown = false;
        game._PlayerLeft.paddle.isUP = false;
      } else if (game._PlayerRight.socket === client) {
        game._PlayerRight.paddle.isDown = false;
        game._PlayerRight.paddle.isUP = false;
      }
    });
  }
  @SubscribeMessage('liveGames')
  handleLiveGames(client: Socket) {}
}
