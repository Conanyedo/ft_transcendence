import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stat } from 'fs';
import { FriendshipService } from 'src/friendship/friendship.service';
import { Stats, userAchievements } from 'src/user/stats.entity';
import { rankDto, statsDto } from 'src/user/user.dto';
import { userStatus } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { gameDto, historyDto, opponentDto } from './game.dto';
import { Game } from './game.entity';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>,
		private readonly userService: UserService
	) { }

	async getRecentMatchesWon(player: string) {
		const matches = await this.gameRepository
			.query(`select games."playerOne", games."playerTwo", games."playerOneScore", games."playerTwoScore", games.date from games where (games."playerOne" = '${player}' or games."playerTwo" = '${player}') order by games.date DESC limit 20`);
		if (matches.length >= 10) {
			const loss = matches.find((match, idx) => {
				if ((match.playerOne === player && match.playerOneScore < match.playerTwoScore) ||
					(match.playerTwo === player && match.playerOneScore > match.playerTwoScore))
					return { ...match, idx };
			});
			if (!loss && matches.length === 20)
				return 20;
			if (!loss || (loss && loss.idx >= 10))
				return 10;
		}
		return 0;
	}


	async updateStats(player: string, gameType: string, winner: boolean) {
		const stats: statsDto = await this.userService.getStats(player);
		stats.numGames++;
		stats.gamesWon += (winner) ? 1 : 0;
		if (gameType === 'Ranked')
			stats.GP += (winner) ? 50 : (stats.GP >= 25) ? -25 : 0;
		const matches = Math.round( 0.04 * ((stats.XP / 1000) ^ 3) + 0.8 * ((stats.XP / 1000) ^ 2) + 2 * (stats.XP / 1000));
		stats.XP += (1000) / matches;
		stats.XP = Math.round(stats.XP);
		await this.userService.updateStats(stats);
		const rankList: rankDto[] = await this.userService.getRank();
		const toBeUpdated: rankDto[] = [];
		rankList.forEach((player, index) => {
			if (player.rank !== index + 1) {
				player.rank = index + 1;
				toBeUpdated.push(player);
			}
		});
		toBeUpdated.forEach((rank) => {
			if (rank.id === stats.id)
				stats.rank = rank.rank;
			this.userService.updateRank(rank.id, rank.rank)
		})

		if (!stats.achievement.includes(userAchievements.FIRSTWIN) && winner && (gameType === 'Ranked'))
			stats.achievement.push(userAchievements.FIRSTWIN);
		if (stats.gamesWon >= 10 && winner) {
			const achiev: number = await this.getRecentMatchesWon(player);
			if (achiev === 10 && !stats.achievement.includes(userAchievements.WON10))
				stats.achievement.push(userAchievements.WON10);
			if (achiev === 20 && !stats.achievement.includes(userAchievements.WON20))
				stats.achievement.push(userAchievements.WON20);
		}
		if (stats.XP >= 5000 && !stats.achievement.includes(userAchievements.LEVEL5))
			stats.achievement.push(userAchievements.LEVEL5);
		if (stats.GP >= 1600 && !stats.achievement.includes(userAchievements.GOLDTIER) && winner)
			stats.achievement.push(userAchievements.GOLDTIER);
		if (stats.rank === 1 && !stats.achievement.includes(userAchievements.FIRSTPLACE) && winner)
			stats.achievement.push(userAchievements.FIRSTPLACE);
		await this.userService.updateAchievements(stats.id, stats.achievement);
	}

	async insertMatches(gameResult: gameDto) {
		let game: Game = new Game();
		game.playerOne = gameResult.playerOne;
		game.playerTwo = gameResult.playerTwo;
		game.playerOneScore = gameResult.playerOneScore;
		game.playerTwoScore = gameResult.playerTwoScore;
		game = await this.gameRepository.save(game);
		const winner: string = (game.playerOneScore > game.playerTwoScore) ? game.playerOne : game.playerTwo;
		const loser: string = (winner === game.playerOne) ? game.playerTwo : game.playerOne;
		await this.updateStats(winner, gameResult.gameType, true);
		await this.updateStats(loser, gameResult.gameType, false);
		await this.userService.setStatus(game.playerOne, userStatus.ONLINE);
		await this.userService.setStatus(game.playerTwo, userStatus.ONLINE);
	}
	
	async startMatch(playerOne: string, playerTwo: string) {
		await this.userService.setStatus(playerOne, userStatus.INGAME);
		await this.userService.setStatus(playerTwo, userStatus.INGAME);
	}

	async getMatches(login: string) {
		const history: Game[] = await this.gameRepository
			.createQueryBuilder('games')
			.select(['games.playerOne', 'games.playerTwo', 'games.playerOneScore', 'games.playerTwoScore', 'games.date'])
			.where(`games.playerOne = :login OR games.playerTwo = :login`, { login: login })
			.orderBy("games.date", "DESC")
			.getMany();
		if (!history.length)
			return { data: history };
		const matches = await Promise.all(history.map(async (match) => {
			const opponentLogin: string = (match.playerOne === login) ? match.playerTwo : match.playerOne;
			const opponent: opponentDto = await this.userService.getOpponent(opponentLogin);
			const result: historyDto = {
				login: opponentLogin,
				fullname: opponent.fullname,
				avatar: opponent.avatar,
				opponentScore: (match.playerOne === login) ? match.playerTwoScore : match.playerOneScore,
				yourScore: (match.playerOne === login) ? match.playerOneScore : match.playerTwoScore,
				date: match.date.toLocaleDateString("en-GB")
			}
			return result;
		}))
		return { data: matches };
	}
}
