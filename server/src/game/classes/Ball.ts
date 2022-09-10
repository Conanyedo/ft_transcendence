
import { GameControlers } from "./Game";
import { Paddle } from "./Paddle";

export class Ball {
	public ballX: number;
	public ballY: number;
	public deltaX: number;
	public deltaY: number;
	public ballSpeed: number;
	public constructor() {
		this.ballX = GameControlers.canvasW / 2;
		this.ballY = GameControlers.canvasH / 2;
		let der = Math.floor((Math.random() + 1) * -1)
		this.deltaX = (der > 0) ? 5 : -5;
		this.deltaY = (der > 0) ? 5 : -5;
        this.ballSpeed = 0.5;
	}
	public resetBall() {
		this.ballX = GameControlers.canvasW / 2;
		this.ballY = GameControlers.canvasH / 2;
		this.ballSpeed = 0.5;
		this.deltaX = -this.deltaX;
		this.deltaY = -this.deltaY;
	}
	public moveBall() {
		this.ballX += this.deltaX * this.ballSpeed;
		this.ballY += this.deltaY * this.ballSpeed;
		if (
		this.ballY + GameControlers.BallRadius > GameControlers.canvasH ||
		this.ballY - GameControlers.BallRadius < 0
		)
		this.deltaY = -this.deltaY;
	}
	public collision(paddle: Paddle) {
		const balltop = this.ballY - GameControlers.BallRadius;
		const ballbottom = this.ballY  + GameControlers.BallRadius;
		const ballleft = this.ballX - GameControlers.BallRadius;
		const ballright = this.ballX + GameControlers.BallRadius;

		const paddletop = paddle.paddleY;
		const paddlebottom = paddle.paddleY + GameControlers.PaddleH;
		const paddleleft = paddle.paddleX;
		const paddleright = paddle.paddleX + GameControlers.PaddleW;

		return (
			ballright > paddleleft &&
			ballbottom > paddletop &&
			ballleft < paddleright &&
			balltop < paddlebottom
		);
	}
}
