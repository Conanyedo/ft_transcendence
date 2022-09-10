import { GameControlers } from './Game';

export class Paddle {
  public paddleY: number;
  public paddleX: number;
  public isUP: boolean;
  public isDown: boolean;
  public _interval: NodeJS.Timer;

  constructor(PaddleX: number) {
    this.paddleY = GameControlers.canvasH / 2 - GameControlers.PaddleH / 2;
    this.paddleX = PaddleX;
    this.isDown = false;
    this.isUP = false;
    this._interval = setInterval(() => {
      this.movePaddle();
    }, 1000 / 60);
  }
  movePaddle() {
    if (this.isUP) this.up();
    else if (this.isDown) this.down();
  }
  public up() {
    if (this.paddleY > 0) this.paddleY -= GameControlers.PaddleSpeed;
  }
  public down() {
    if (this.paddleY < (GameControlers.canvasH - GameControlers.PaddleH))
      this.paddleY += GameControlers.PaddleSpeed;
  }
}
