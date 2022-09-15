import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Game, Lobby, LobbyFriends } from './classes/Game';
import { LiveGame } from './classes/liveGames';
import { Player } from './classes/Player';

@WebSocketGateway(5551, { cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  users: Lobby[] = [];
  Friends: LobbyFriends[] = [];
  gamesRank: Game[] = [];
  gamesFriend: Game[] = [];
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('game connection: ', client.id);
    // client.disconnect();
  }
  handleDisconnect(client: Socket) {
    console.log('Desconnect: ', client.id);
    if (this.gamesRank.length) {
      this.gamesRank.find((game) => {
        if (
          game._PlayerLeft.socket === client ||
          game._PlayerRight.socket === client
        )
          this.gamesRank.splice(this.gamesRank.indexOf(game), 1);
      });
    }
    this.users = this.users.filter((user) => user.client !== client);
  }
  @SubscribeMessage('joinGame')
  handleEventJoinGame(client: Socket, data: any): void {
    console.log(client.id);
    if (this.users.length && this.users[0].login === data) {
      console.log(this.users[0].login, '|', data);
      // TODO check if (in Game) 
      return;
    }
    console.log(client.id, 'add');
    this.users.push(new Lobby(data, '', client));
    if (this.users.length > 1 && this.users[0].login !== this.users[1].login) {
      console.log('game: ', this.users.length);
      const player = new Player(
        this.users[0].login,
        this.users[0].client,
        'left',
      );
      const playertwo = new Player(
        this.users[1].login,
        this.users[1].client,
        'right',
      );
      const newGame = new Game(player, playertwo, 'Rank', this.server);
      this.gamesRank.push(newGame);
      this.users.splice(0, 2);
    }
  }
  @SubscribeMessage('joinGameFriend')
  handleEventJoinGameFriend(client: Socket, data: any): void {
    const isfriend = this.Friends.find(
      (game) => data.accept && game.idGame === data.accept,
    );
    if (data.accept && isfriend && isfriend.idGame) {
      const player = new Player(isfriend.admin, isfriend.adminSocket, 'left');
      const playertwo = new Player(data.login, client, 'right');
      console.log(player.login, '|', playertwo.login, '|', isfriend.idGame);
      const newGame = new Game(player, playertwo, 'Classic', this.server);
      this.gamesFriend.push(newGame);
    } else if (!data.accept) {
      const newLobby = new LobbyFriends(data.login, client);
      this.Friends.push(newLobby);
      client.emit('getCode', newLobby.idGame);
    }
  }
  @SubscribeMessage('go_Up')
  handlechangePaddleUp(client: Socket, data: any): void {
    this.gamesRank.find((game) => {
      if (game._PlayerLeft.socket === client)
        game._PlayerLeft.paddle.isUP = true;
      else if (game._PlayerRight.socket === client)
        game._PlayerRight.paddle.isUP = true;
    });
    this.gamesFriend.find((game) => {
      if (game._PlayerLeft.socket === client)
        game._PlayerLeft.paddle.isUP = true;
      else if (game._PlayerRight.socket === client)
        game._PlayerRight.paddle.isUP = true;
    });
  }
  @SubscribeMessage('go_Down')
  handlechangePaddleDown(client: Socket, data: any): void {
    this.gamesRank.find((game) => {
      if (game._PlayerLeft.socket === client)
        game._PlayerLeft.paddle.isDown = true;
      else if (game._PlayerRight.socket === client) {
        game._PlayerRight.paddle.isDown = true;
      }
    });
    this.gamesFriend.find((game) => {
      if (game._PlayerLeft.socket === client)
        game._PlayerLeft.paddle.isDown = true;
      else if (game._PlayerRight.socket === client)
        game._PlayerRight.paddle.isDown = true;
    });
  }
  @SubscribeMessage('stop')
  handlestopPaddle(client: Socket, data: any): void {
    this.gamesRank.find((game) => {
      if (game._PlayerLeft.socket === client) {
        game._PlayerLeft.paddle.isDown = false;
        game._PlayerLeft.paddle.isUP = false;
      } else if (game._PlayerRight.socket === client) {
        game._PlayerRight.paddle.isDown = false;
        game._PlayerRight.paddle.isUP = false;
      }
    });
    this.gamesFriend.find((game) => {
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
  handleLiveGamesRank(client: Socket) {
    let arry: LiveGame[] = [];
    if (this.gamesRank.length)
      this.gamesRank.map((game) => {
        const tmp = new LiveGame(
          game._PlayerLeft.login,
          game._PlayerLeft.score,
          game._matchType,
          game._PlayerRight.login,
          game._PlayerRight.score,
          game._ID,
        );
        arry.push(tmp);
      });
    if (this.gamesFriend.length)
      this.gamesFriend.map((game) => {
        const tmp = new LiveGame(
          game._PlayerLeft.login,
          game._PlayerLeft.score,
          game._matchType,
          game._PlayerRight.login,
          game._PlayerRight.score,
          game._ID,
        );
        arry.push(tmp);
      });
    client.emit('AllGames', { arry });
  }

  @SubscribeMessage('watchGame')
  watchGameByID(client: Socket, data: any) {
    let game: Game;
    if (this.gamesFriend.length)
      game = this.gamesFriend.find((game) => game._ID === data.ID);
    else if (this.gamesRank.length)
      game = this.gamesRank.find((game) => game._ID === data.ID);
    if (game) client.join(`${game._ID}`);
  }
  @SubscribeMessage('leaveQueue')
  leaveQueue(client: Socket, data: string) {
    console.log(client.id);
    console.log(this.users.length);
    if (this.users.length)
      this.users = this.users.filter(
        (user) =>
          user.login !== data && user.client.id !== client.id
      );
    console.log(this.users.length);
  }
  @SubscribeMessage('exitFromSocket')
  exitFromSocket(client: Socket, data: any) {
    let game: Game;
    if (this.gamesFriend.length)
      game = this.gamesFriend.find((game) => game._ID === data.ID);
    else if (this.gamesRank.length)
      game = this.gamesRank.find((game) => game._ID === data.ID);
    if (game) client.leave(game._ID);
  }
}
