import { Socket } from "socket.io";
import { GameControlers } from "./Game";
import { Paddle } from "./Paddle";

export class Player {
	private login: string;
	private socket: Socket;
	private pos: string;
	private paddle: Paddle;
	private score: number;
	constructor(login: string, socket: Socket, pos: string) {
		this.login = login;
		this.socket = socket;
        this.pos = pos;
		this.paddle = (pos !== 'left') ? new Paddle(GameControlers.canvasW - GameControlers.PaddleW) : new Paddle(0);
        this.score = 0;
	}
	getlogin() {
		return this.login;
	}
	getsocket() {
		return this.socket;
	}
	getpos() {
		return this.pos;
	}
	getpaddle() {
		return this.paddle;
	}
	getscore() {
		return this.score;
	}
	setlogin(login: string) {
		this.login = login;
	}
	setsocket(socket: Socket) {
		this.socket = socket;
	}
	setpos(pos: string) {
		this.pos = pos;
	}
	setpaddle(paddle: Paddle) {
		this.paddle = paddle;
	}
	increasescore() {
		this.score++;
	}
	setscore(score: number) {
		this.score = score;
	}
}
