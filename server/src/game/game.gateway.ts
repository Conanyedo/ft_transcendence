import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { allGames } from './classes/AllGames';
import { GameService } from './game.service';

@WebSocketGateway(5551)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (public readonly gameService: GameService) {}
	@WebSocketServer()
	server: Server;
	allGames: allGames;

	handleConnection(client: Socket) {
		if (this.allGames?.server !== this.server) {
			this.allGames = new allGames(this.server, this.gameService)
		}
	}
	handleDisconnect(client: Socket) {
		this.allGames.clientDisconnect(client);
	}
	@SubscribeMessage('resumeGame')
	handleEventResumeGame(client: Socket, login: string): void {
        this.allGames.clientConnected(client, login);
	}
	@SubscribeMessage('joinGame')
	handleEventJoinGame(client: Socket, login: string): void {
        this.allGames.joinRankLobby(client, login);
	}
	@SubscribeMessage('newFriendGame')
	newFriendGame(client: Socket, data: any) {
		return this.allGames.newFriendGame(client, data);
	}
	@SubscribeMessage('FriendGameInfo')
	FriendGameInfo(client: Socket, gameID: any) {
		return this.allGames.FriendGameInfo(client, gameID);
	}
	@SubscribeMessage('joinGameFriend')
	handleEventJoinGameFriend(client: Socket, data: any): string {
		return this.allGames.joinFriendGame(client, data.accept, data.login);
	}
	@SubscribeMessage('go_Up')
	handlechangePaddleUp(client: Socket): void {
		this.allGames.movePaddleUP(client);
	}
	@SubscribeMessage('go_Down')
	handlechangePaddleDown(client: Socket): void {
		this.allGames.movePaddleDown(client);
	}
	@SubscribeMessage('stop')
	handlestopPaddle(client: Socket): void {
		this.allGames.stopPaddle(client);
	}
	@SubscribeMessage('liveGames')
	handleLiveGamesRank(client: Socket) {
		this.allGames.liveGames();
	}
	@SubscribeMessage('watchGame')
	watchGameByID(client: Socket, data: any) {
		this.allGames.watchGame(client, data.ID);
	}
	@SubscribeMessage('leaveQueue')
	leaveQueue(client: Socket, login: string) {
		this.allGames.leaveRankLobby(client, login);
	}
	@SubscribeMessage('exitFromSocket')
	exitFromSocket(client: Socket, data: any) {
		this.allGames.leaveWatchGame(client, data.ID);
	}
	@SubscribeMessage('checkMatchID')
	checkMatchID(client: Socket, gameID: string) {
		this.allGames.checkMatchID(client, gameID);
	}
	@SubscribeMessage('refuseChallenge')
	refuseChallenge(client: Socket, gameID: string) {
		this.allGames.refuseChallenge(client, gameID);
	}
	@SubscribeMessage('removeGameLobby')
	removeGameLobby(client: Socket, gameID: string) {
		this.allGames.removeGameLobby(client, gameID);
	}
	@SubscribeMessage('checkLobby')
	checkLobby(client: Socket, data: {admin:string, login: string}) {
		return this.allGames.checkLobby(client, data);
	}
	@SubscribeMessage('getGameId')
	getGameId(client: Socket, login: string) {
		return this.allGames.getGameId(login);
	}
	@SubscribeMessage('isGameStarted')
	isGameStarted(client: Socket, idGame: string) {
		return this.allGames.isGameStarted(client, idGame);
	}
}