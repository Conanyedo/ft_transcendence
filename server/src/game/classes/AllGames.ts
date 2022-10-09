import { Server, Socket } from 'socket.io';
import { GameService } from '../game.service';
import { Game, Lobby, LobbyFriends } from './Game';
import { LiveGame } from './liveGames';
import { Player } from './Player';

export class allGames {
  RankGames: Game[];
  FriendGames: Game[];
  RankLobby: Lobby[];
  FriendsLobby: LobbyFriends[];
  countLiveGames: number;
  server: Server;

  constructor(server: Server, public readonly gameService: GameService) {
    this.server = server;
    this.RankGames = [];
    this.FriendGames = [];
    this.RankLobby = [];
    this.FriendsLobby = [];
    this.countLiveGames = 0;
  }

  joinRankLobby(client: Socket, login: string) {
    const inRankGame = this.RankGames?.find(
      (game) =>
        game._PlayerLeft?.getlogin() === login ||
        game._PlayerRight?.getlogin() === login,
    );
    const inFriendGame = this.FriendGames?.find(
      (game) =>
        game._PlayerLeft?.getlogin() === login ||
        game._PlayerRight?.getlogin() === login,
    );
    if (
      inRankGame ||
      inFriendGame ||
      (this.RankLobby.length && this.RankLobby[0]?.login === login)
    ) {
      client.emit('errorCheck', 'in game already');
      return;
    }
    this.RankLobby.push(new Lobby(login, '', client));
    if (
      this.RankLobby.length > 1 &&
      this.RankLobby[0].login !== this.RankLobby[1].login
    ) {
      const player = new Player(
        this.RankLobby[0].login,
        this.RankLobby[0].client,
        'left',
      );
      const playertwo = new Player(
        this.RankLobby[1].login,
        this.RankLobby[1].client,
        'right',
      );
      const newGame = new Game(player, playertwo, 'Ranked', this.server, this);
      this.countLiveGames++;
      this.RankGames.push(newGame);
      this.RankLobby.splice(0, 2);
    }
  }
  newFriendGame(client: Socket, data: any) {
    const newLobby = new LobbyFriends(
      data.login,
      client,
      data.friend,
      data.Theme,
    );
    this.FriendsLobby.push(newLobby);
    return newLobby.idGame;
  }
  FriendGameInfo(client: Socket, idGame: string) {
    if (!idGame && !this.FriendsLobby.length) return;
    let game: LobbyFriends;
    if (idGame) game = this.FriendsLobby.find((game) => game.idGame == idGame);
    if (game) {
      return {
        gameID: game.idGame,
        admin: game.admin,
        friend: game.friend,
        Theme: game.theme,
      };
    }
  }
  joinFriendGame(client: Socket, GameID: string, login: string) {
    const isfriend = this.FriendsLobby.find(
      (game) => GameID && game.idGame === GameID,
    );
    if (GameID && isfriend && isfriend.idGame) {
      isfriend.adminSocket.emit('gameStartedSoon', {
        check: true,
        id: isfriend.idGame,
      });
        const player = new Player(isfriend.admin, isfriend.adminSocket, 'left');
        const playertwo = new Player(login, client, 'right');
        const newGame = new Game(
          player,
          playertwo,
          'Classic',
          this.server,
          this,
          isfriend.idGame,
          Number(isfriend.theme),
        );
        this.countLiveGames++;
        this.FriendGames.push(newGame);
      return GameID;
    }
  }
  movePaddleUP(client: Socket) {
    this.RankGames.find((game) => {
      if (game._PlayerLeft.getsocket() === client) {
        game._PlayerLeft.getpaddle().setIsUp(true);
        return;
      } else if (game._PlayerRight.getsocket() === client) {
        game._PlayerRight.getpaddle().setIsUp(true);
        return;
      }
    });
    this.FriendGames.find((game) => {
      if (game._PlayerLeft.getsocket() === client) {
        game._PlayerLeft.getpaddle().setIsUp(true);
        return;
      } else if (game._PlayerRight.getsocket() === client) {
        game._PlayerRight.getpaddle().setIsUp(true);
        return;
      }
    });
  }
  movePaddleDown(client: Socket) {
    this.RankGames.find((game) => {
      if (game._PlayerLeft.getsocket() === client) {
        game._PlayerLeft.getpaddle().setIsDown(true);
        return;
      } else if (game._PlayerRight.getsocket() === client) {
        game._PlayerRight.getpaddle().setIsDown(true);
        return;
      }
    });
    this.FriendGames.find((game) => {
      if (game._PlayerLeft.getsocket() === client) {
        game._PlayerLeft.getpaddle().setIsDown(true);
        return;
      } else if (game._PlayerRight.getsocket() === client) {
        game._PlayerRight.getpaddle().setIsDown(true);
        return;
      }
    });
  }
  stopPaddle(client: Socket) {
    this.RankGames.find((game) => {
      if (game._PlayerLeft.getsocket().id === client.id) {
        game._PlayerLeft.getpaddle().setIsDown(false);
        game._PlayerLeft.getpaddle().setIsUp(false);
        return;
      } else if (game._PlayerRight.getsocket().id === client.id) {
        game._PlayerRight.getpaddle().setIsDown(false);
        game._PlayerRight.getpaddle().setIsUp(false);
        return;
      }
    });
    this.FriendGames.find((game) => {
      if (game._PlayerLeft.getsocket().id === client.id) {
        game._PlayerLeft.getpaddle().setIsDown(false);
        game._PlayerLeft.getpaddle().setIsUp(false);
        return;
      } else if (game._PlayerRight.getsocket() === client) {
        game._PlayerRight.getpaddle().setIsDown(false);
        game._PlayerRight.getpaddle().setIsUp(false);
        return;
      }
    });
  }
  liveGames() {
    let arry: LiveGame[] = [];
    if (!this.countLiveGames) this.server.emit('AllGames', { arry });
    if (this.RankGames.length)
      this.RankGames.map((game) => {
        const tmp = new LiveGame(
          game._PlayerLeft.getlogin(),
          game._PlayerLeft.getscore(),
          game._matchType,
          game._PlayerRight.getlogin(),
          game._PlayerRight.getscore(),
          game._ID,
        );
        arry.push(tmp);
      });
    if (this.FriendGames.length)
      this.FriendGames.map((game) => {
        const tmp = new LiveGame(
          game._PlayerLeft.getlogin(),
          game._PlayerLeft.getscore(),
          game._matchType,
          game._PlayerRight.getlogin(),
          game._PlayerRight.getscore(),
          game._ID,
        );
        arry.push(tmp);
      });
    this.server.emit('AllGames', { arry });
  }
  watchGame(client: Socket, GameId: string) {
    let game: Game;
    if (this.FriendGames.length)
      game = this.FriendGames.find((game) => game._ID === GameId);
    else if (this.RankGames.length)
      game = this.RankGames.find((game) => game._ID === GameId);
    if (game) {
      if (!client.rooms.has(game._ID)) client.join(`${game._ID}`);
      game.EmitScore(this.server);
    }
  }
  leaveWatchGame(client: Socket, gameID: string) {
    let game: Game;
    if (this.FriendGames.length)
      game = this.FriendGames.find((game) => game._ID === gameID);
    else if (this.RankGames.length)
      game = this.RankGames.find((game) => game._ID === gameID);
    if (game) client.leave(game._ID);
  }
  leaveRankLobby(client: Socket, login: string) {
    if (this.RankLobby.length)
      this.RankLobby = this.RankLobby.filter(
        (user) => user.login !== login && user.client.id !== client.id,
      );
  }
  checkMatchID(client: Socket, GameID: string) {
    let game: Game;
    if (this.FriendGames.length)
      game = this.FriendGames.find((game) => game._ID === GameID);
    else if (this.RankGames.length)
      game = this.RankGames.find((game) => game._ID === GameID);
    if (!game) client.emit('MatchNotFound');
  }
  removeGame(gameID: string) {
    const oldRankLength = this.RankGames.length;
    const oldFriendLength = this.FriendGames.length;
    if (this.FriendGames.length)
      this.FriendGames = this.FriendGames.filter((game) => game._ID !== gameID);
    else if (this.RankGames.length)
      this.RankGames = this.RankGames.filter((game) => game._ID !== gameID);
    if (
      oldFriendLength !== this.FriendGames.length ||
      oldRankLength !== this.RankGames.length
    ) {
      this.countLiveGames--;
      this.liveGames();
    }
  }
  clientConnected(client: Socket, login: string) {
    if (this.RankGames.length && login) {
      const game = this.RankGames.find(
        (game) =>
          game._PlayerLeft.getlogin() === login ||
          game._PlayerRight.getlogin() === login,
      );
      if (
        game &&
        client.id !== game._PlayerLeft.getsocket().id &&
        client.id !== game._PlayerRight.getsocket().id
      )
        game.resumeGame(client, login, this.server);
    }
    if (this.FriendGames.length && login) {
      const game = this.FriendGames.find(
        (game) =>
          game._PlayerLeft.getlogin() === login ||
          game._PlayerRight.getlogin() === login,
      );
      if (
        game &&
        client.id !== game._PlayerLeft.getsocket().id &&
        client.id !== game._PlayerRight.getsocket().id
      )
        game.resumeGame(client, login, this.server);
    }
  }
  clientDisconnect(client: Socket) {
    if (this.RankGames.length) {
      const game = this.RankGames.find(
        (game) =>
          game._PlayerLeft.getsocket().id === client.id ||
          game._PlayerRight.getsocket().id === client.id,
      );
      if (game) game.pausegame(this.server, this, client);
    }
    if (this.FriendGames.length) {
      const game = this.FriendGames.find(
        (game) =>
          game._PlayerLeft.getsocket().id === client.id ||
          game._PlayerRight.getsocket().id === client.id,
      );
      if (game) game.pausegame(this.server, this, client);
    }
    if (this.RankLobby.length)
      this.RankLobby = this.RankLobby.filter(
        (user) => user.client.id !== client.id,
      );
    if (this.FriendsLobby.length)
      this.FriendsLobby = this.FriendsLobby.filter(
        (user) => user.adminSocket.id !== client.id,
      );
  }
  refuseChallenge(client: Socket, gameID: string) {
    if (this.FriendsLobby.length && gameID) {
      this.FriendsLobby = this.FriendsLobby.filter((lobby) => {
        if (lobby.idGame === gameID) {
          lobby.adminSocket.emit('gameStarted', false);
        } else {
          return lobby;
        }
      });
    }
  }
  removeGameLobby(client: Socket, gameID: string) {
    if (this.FriendsLobby.length && gameID)
      this.FriendsLobby = this.FriendsLobby.filter(
        (lobby) => lobby.idGame !== gameID,
      );
  }
  checkLobby(client: Socket, data: { admin: string; login: string }) {
    let lobby: LobbyFriends;
    if (this.FriendsLobby.length)
      lobby = this.FriendsLobby.find((lobby) => {
        if (lobby.admin === data.admin && lobby.friend === data.login)
          return lobby;
      });
    if (lobby && lobby.admin !== '') return true;
    return false;
  }
  getGameId(login: string) {
    let game: Game;
    if (this.RankGames.length) {
      game = this.RankGames.find(game => {
          if (game._PlayerLeft.getlogin() === login || game._PlayerRight.getlogin() === login)
          return game;
      })
    }
    if (this.FriendGames.length && !game) {
      game = this.FriendGames.find(game => {
        if (game._PlayerLeft.getlogin() === login || game._PlayerRight.getlogin() === login)
        return game;
    })
    }
    if (game && game?._ID)
      return game._ID;
    return null;
  }

	isGameStarted(client: Socket, idGame: string) {
		if (this.FriendGames.length && idGame) {
			const game: Game = this.FriendGames.find(game => game._ID === idGame);
			if (game?._ID === idGame)
				client.emit('gameStarted', true);
		}
	}
}
