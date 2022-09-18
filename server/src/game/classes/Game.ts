import { Server, Socket } from 'socket.io';
import { allGames } from './AllGames';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { Player } from './Player';

export class Game {
  public _PlayerLeft: Player;
  public _PlayerRight: Player;
  public _Ball: Ball;
  public _inTerval: NodeJS.Timer;
  public _Status: string;
  public _matchType: string;
  public _ID: string;
  public _sockets: Socket[];
  public theme: number;
  public pause: boolean;

  constructor(
    first: Player,
    second: Player,
    matchType: string,
    socket: Server,
    games: allGames
  ) {
    this.pause = false;
    this.theme = Math.floor(Math.random() * 3);
    console.log(this.theme);
    
    this._matchType = matchType;
    this._PlayerLeft = first;
    this._PlayerRight = second;
    this._ID = Math.random().toString(16).slice(2);
    first.getsocket().join(this._ID);
    second.getsocket().join(this._ID);
    socket.to(this._ID).emit('startsoon');
    const tmp = {
      id: this._ID,
      login: this._PlayerRight.getlogin(),
    };
    this._PlayerLeft.getsocket().emit('getCode', tmp);
    tmp.login = this._PlayerLeft.getlogin();
    this._PlayerRight.getsocket().emit('getCode', tmp);
    this._Ball = new Ball();
    setTimeout(() => {
      this.EmitScore(socket);
    }, 5100);
    setTimeout(() => {
      this._inTerval = setInterval(() => {
        this.startGame(socket, games);
        this.EmitStatusGame(socket);
      }, 1000 / 60);
    }, 5000);
  }

  public startGame(socket: Server, games: allGames) {
    if (this.pause)
      return ;
    this._Ball.moveBall();
    const paddle: Paddle =
      this._Ball.getBallX() < GameControlers.canvasW / 2
        ? this._PlayerLeft.getpaddle()
        : this._PlayerRight.getpaddle();
    if (this._Ball.collision(paddle)) {
      if (
        (this._Ball.getBallY() < paddle.getPaddleY() + GameControlers.PaddleH / 3 &&
          this._Ball.getDeltaY() > 0) ||
        (this._Ball.getBallY() >
          paddle.getPaddleY() +
            GameControlers.PaddleH -
            GameControlers.PaddleH / 3 &&
          this._Ball.getDeltaY() < 0)
      )
        this._Ball.reverseDeltaY();
      this._Ball.reverseDeltaX()
      if (this._Ball.getBallSpeed() < 4.4)
        this._Ball.increaseSpeed();
    }
    if (this._Ball.getBallX() - GameControlers.BallRadius < 0) {
      this._PlayerRight.increasescore();
      this.EmitScore(socket);
      this._Ball.resetBall();
    } else if (
      this._Ball.getBallX() + GameControlers.BallRadius >
      GameControlers.canvasW
    ) {
      this._PlayerLeft.increasescore();
      this.EmitScore(socket);
      this._Ball.resetBall();
    }
    this._Status = 'In Game';
    if (this._PlayerLeft.getscore() === 3 || this._PlayerRight.getscore() === 3)
      this.EndGame(socket, games);
  }

  public EndGame(socket: Server, games: allGames) {
    this._Status = 'GameOver';
    socket.to(`${this._ID}`).emit('GameOver', {
      winner:
        this._PlayerLeft.getscore() > this._PlayerRight.getscore()
          ? this._PlayerLeft.getlogin()
          : this._PlayerRight.getlogin(),
    });
    console.log('salat game', this._ID);
    clearInterval(this._inTerval);
    games.removeGame(this._ID);
  }

  public EmitStatusGame(server: Server) {
    server.to(`${this._ID}`).emit('gameStats', {
      ball: { ballX: this._Ball.getBallX(), ballY: this._Ball.getBallY() },
      paddleLeft: { paddleY: this._PlayerLeft.getpaddle().getPaddleY() },
      paddleRight: { paddleY: this._PlayerRight.getpaddle().getPaddleY() },
      themeMap: this.theme,
    });
  }

  public EmitScore(server: Server) {
    server.to(`${this._ID}`).emit('ScoreStatus', {
      firstPlayer: this._PlayerLeft.getlogin(),
      secondPlayer: this._PlayerRight.getlogin(),
      gameType: this._matchType,
      gameId: this._ID,
      secondScore: this._PlayerRight.getscore(),
      firstScore: this._PlayerLeft.getscore(),
    });
  }
  public pausegame(server: Server, games: allGames) {
    this.pause = true;
    server.to(this._ID).emit('GameOnpause', true);
    setTimeout(() => {
      if (this.pause) {
        server.to(this._ID).emit('GameOnpause', false);
        this.EndGame(server, games);
      }
    }, 5000);
  }
  public resumeGame(client: Socket, login: string, server: Server) {
    if (login === this._PlayerLeft.getlogin() && client.id !== this._PlayerLeft.getsocket().id) {
      this._PlayerLeft.getsocket().leave(this._ID);
      this._PlayerLeft.setsocket(client);
      server.to(this._ID).emit('GameOnpause', false);
      client.join(this._ID);
      this.pause = false;
    }
    else  if (login === this._PlayerRight.getlogin() && client.id !== this._PlayerRight.getsocket().id) {
      this._PlayerRight.getsocket().leave(this._ID);
      this._PlayerRight.setsocket(client);
      server.to(this._ID).emit('GameOnpause', false);
      client.join(this._ID);
      this.pause = false;
    }
  }
}

export class GameControlers {
  paddlX: number;
  paddlY: number;

  static readonly canvasW: number = 1500;
  static readonly canvasH: number = this.canvasW / 2;
  static readonly PaddleSpeed: number = 10;
  static readonly BallRadius: number = 10;
  static readonly PaddleH: number = this.canvasH / 8;
  static readonly PaddleW: number = 20.1;
  static readonly MaxSpeedBall: number = 0.1;
  static readonly MaxScore: number = 3;
}

export class Lobby {
  login: string;
  avatar: string;
  client: Socket;
  constructor(login: string, avatar: string, client: Socket) {
    this.login = login;
    this.avatar = avatar;
    this.client = client;
  }
}

export class LobbyFriends {
  admin: string;
  adminSocket: Socket;
  friend: string;
  friendSocket: Socket;
  idGame: string;

  constructor(admin: string, adminSocket: Socket) {
    this.friend = '';
    this.admin = admin;
    this.adminSocket = adminSocket;
    this.idGame = Math.random().toString(16).slice(2);
    adminSocket.emit('idLobby', this.idGame);
  }

  startGame(friend: string, friendSocket: Socket) {
    this.friend = friend;
    this.friendSocket = friendSocket;
  }
}
