import { Socket } from "socket.io";
import { GameControlers } from "./Game";
import { Paddle } from "./Paddle";

export class Player {
	public login: string;
	public socket: Socket;
	public pos: string;
	public paddle: Paddle;
	public score: number;
	constructor(login: string, socket: Socket, pos: string) {
		this.login = login;
		this.socket = socket;
        this.pos = pos;
		this.paddle = (pos !== 'left') ? new Paddle(GameControlers.canvasW - GameControlers.PaddleW) : new Paddle(0);
        this.score = 0;
	}
}