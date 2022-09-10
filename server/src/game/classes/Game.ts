import { Socket } from 'socket.io';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { Player } from './Player';

export class Game {
  public _PlayerLeft: Player;
  public _PlayerRight: Player;
  public _Ball: Ball;
  public _inTerval: NodeJS.Timer;
  public _Status: string;
  constructor(first: Player, second: Player) {
    this._PlayerLeft = first;
    this._PlayerRight = second;
    this._Ball = new Ball();
    this._PlayerLeft.socket.emit('startsoon');
    this._PlayerRight.socket.emit('startsoon');
    setTimeout(() => {
      this._inTerval = setInterval(() => {
        this.startGame();
      }, 1000 / 60);
    }, 5000);
  }
  public startGame() {
    this._Ball.moveBall();
    const paddle: Paddle =
      this._Ball.ballX < GameControlers.canvasW / 2
        ? this._PlayerLeft.paddle
        : this._PlayerRight.paddle;
    if (this._Ball.collision(paddle)) {
      this._Ball.deltaX = -this._Ball.deltaX;
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
      this.EndGame();
    this._PlayerLeft.socket.emit('gameStats', {
      ball: { ballX: this._Ball.ballX, ballY: this._Ball.ballY },
      paddleLeft: { paddleY: this._PlayerLeft.paddle.paddleY },
      paddleRight: { paddleY: this._PlayerRight.paddle.paddleY },
      GameStatus: this._Status,
      myScore: this._PlayerLeft.score,
      otherScore: this._PlayerRight.score,
    });
    this._PlayerRight.socket.emit('gameStats', {
      ball: { ballX: this._Ball.ballX, ballY: this._Ball.ballY },
      paddleLeft: { paddleY: this._PlayerLeft.paddle.paddleY },
      paddleRight: { paddleY: this._PlayerRight.paddle.paddleY },
      GameStatus: this._Status,
      myScore: this._PlayerRight.score,
      otherScore: this._PlayerLeft.score,
    });
  }
  public EndGame() {
    this._Status = 'GameOver';
    console.log('salat game');
    clearInterval(this._inTerval);
    this._PlayerLeft.socket.disconnect();
    this._PlayerRight.socket.disconnect();
  }
}

export class GameControlers {
  paddlX: number;
  paddlY: number;

  static readonly canvasW: number = 1500;
  static readonly canvasH: number = 900;
  static readonly PaddleSpeed: number = 10;
  static readonly BallRadius: number = 10;
  static readonly PaddleH: number = this.canvasH / 8;
  static readonly PaddleW: number = 10;
  static readonly MaxSpeedBall: number = 0.1;
  static readonly MaxScore: number = 3;
}

export class Lobby {
  login: string;
  avatar: string;
  client: Socket;
  constructor(login: string, avatar: string, client) {
    this.login = login;
    this.avatar = avatar;
    this.client = client;
  }
}
