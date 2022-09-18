import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { allGames } from './classes/AllGames';

@WebSocketGateway(5551, { cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	allGames: allGames;

	handleConnection(client: Socket, ...args: any[]) {
		console.log('game connection: ', client.id);
		// client.disconnect();
		if (this.allGames?.server !== this.server) {
			this.allGames = new allGames(this.server)
		}
	}
	handleDisconnect(client: Socket) {
		console.log('game Disconnect: ', client.id);
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
	@SubscribeMessage('joinGameFriend')
	handleEventJoinGameFriend(client: Socket, data: any): void {
		this.allGames.joinFriendGame(client, data.accept, data.login);
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
}