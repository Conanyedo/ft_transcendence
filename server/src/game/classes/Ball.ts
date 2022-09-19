
import { GameControlers } from "./Game";
import { Paddle } from "./Paddle";

export class Ball {
	private ballX: number;
	private ballY: number;
	private deltaX: number;
	private deltaY: number;
	private ballSpeed: number;
	public constructor() {
		this.ballX = GameControlers.canvasW / 2;
		this.ballY = GameControlers.canvasH / 2;
		let der = Math.floor(Math.random() * 2) + 1;
		this.deltaX = (der > 0) ? 5 : -6;
		this.deltaY = (der < 0) ? 5 : -4;
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
		if ( this.ballY + GameControlers.BallRadius > GameControlers.canvasH ||
		this.ballY - GameControlers.BallRadius < 0 )
		this.deltaY = -this.deltaY;
		this.ballX += this.deltaX * this.ballSpeed;
		this.ballY += this.deltaY * this.ballSpeed;
	}
	public collision(paddle: Paddle) {
		const balltop = this.ballY - GameControlers.BallRadius;
		const ballbottom = this.ballY  + GameControlers.BallRadius;
		const ballleft = this.ballX - GameControlers.BallRadius;
		const ballright = this.ballX + GameControlers.BallRadius;

		const paddletop = paddle.getPaddleY();
		const paddlebottom = paddle.getPaddleY() + GameControlers.PaddleH;
		const paddleleft = paddle.getPaddleX();
		const paddleright = paddle.getPaddleX() + GameControlers.PaddleW;

		return (
			ballright > paddleleft &&
			ballbottom > paddletop &&
			ballleft < paddleright &&
			balltop < paddlebottom
		);
	}
	public getBallX() {
		return this.ballX;
	}
	public getBallY() {
		return this.ballY;
	}
	public getdeltaX() {
		return this.deltaX;
	}
	public getDeltaY() {
		return this.deltaY;
	}
	public getBallSpeed() {
		return this.ballSpeed;
	}
	public reverseDeltaX() {
		this.deltaX = -this.deltaX;
	}
	public reverseDeltaY() {
		this.deltaY = -this.deltaY;
	}
	public increaseSpeed() {
		this.ballSpeed += GameControlers.MaxSpeedBall;
	}
}
