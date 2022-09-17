import { throws } from 'assert';
import { Server, Socket } from 'socket.io';
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
  constructor(first: Player, second: Player, matchType: string, socket: Server) {
    this._matchType = matchType;
    this._PlayerLeft = first;
    this._PlayerRight = second;
    this._ID = Math.random().toString(16).slice(2);
    first.socket.join(`${this._ID}`);
    second.socket.join(`${this._ID}`);
    socket.to(`${this._ID}`).emit('getCode', this._ID);
    this._Ball = new Ball();
    socket.to(`${this._ID}`).emit('startsoon');
    setTimeout(() => {
      this._inTerval = setInterval(() => {
        this.startGame(socket);
        this.EmitStatusGame(socket);
      }, 1000 / 60);
    }, 5000);
  }
  public startGame(socket: Server) {
    this._Ball.moveBall();
    const paddle: Paddle =
      this._Ball.ballX < GameControlers.canvasW / 2
        ? this._PlayerLeft.paddle
        : this._PlayerRight.paddle;
    if (this._Ball.collision(paddle)) {
      if (
        (this._Ball.ballY < paddle.paddleY + GameControlers.PaddleH / 3 &&
          this._Ball.deltaY > 0) ||
        (this._Ball.ballY >
          paddle.paddleY +
            GameControlers.PaddleH -
            GameControlers.PaddleH / 3 &&
          this._Ball.deltaY < 0)
      )
        this._Ball.deltaY = -this._Ball.deltaY;
      this._Ball.deltaX = -this._Ball.deltaX;
      if (this._Ball.ballSpeed < 4.4)
        this._Ball.ballSpeed += GameControlers.MaxSpeedBall;
    }
    if (this._Ball.ballX - GameControlers.BallRadius < 0) {
      this._PlayerRight.score++;
      this._Ball.resetBall();
    } else if (
      this._Ball.ballX + GameControlers.BallRadius >
      GameControlers.canvasW
    ) {
      this._PlayerLeft.score++;
      this._Ball.resetBall();
    }
    this._Status = 'In Game';
    if (this._PlayerLeft.score === 3 || this._PlayerRight.score === 3)
      this.EndGame(socket);
  }
  public EndGame(socket: Server) {
    socket.to(`${this._ID}`).emit('GameOver');
    this._Status = 'GameOver';
    console.log('salat game');
    clearInterval(this._inTerval);
    socket.to(`${this._ID}`).disconnectSockets();
    socket.socketsLeave(`${this._ID}`);
  }
  public EmitStatusGame(server: Server) {
    server.to(`${this._ID}`).emit('gameStats', {
          ball: { ballX: this._Ball.ballX, ballY: this._Ball.ballY },
          paddleLeft: { paddleY: this._PlayerLeft.paddle.paddleY },
          paddleRight: { paddleY: this._PlayerRight.paddle.paddleY },
          GameStatus: this._Status,
          myScore: this._PlayerRight.score,
          otherScore: this._PlayerLeft.score,
        })
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
    console.log('GameFriend Id: ', this.idGame);
	adminSocket.emit('idLobby', this.idGame);
  }
  startGame(friend: string, friendSocket: Socket) {
    this.friend = friend;
    this.friendSocket = friendSocket;
  }
}
