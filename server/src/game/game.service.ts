import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { historyDto, opponentDto } from './game.dto';
import { Game } from './game.entity';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>,
		private readonly userService: UserService,
	) { }

	async insertMatches(login: string) {

	}

	async getMatches(login: string) {
		const history: Game[] = await this.gameRepository
			.createQueryBuilder('games')
			.select(['games.playerOne', 'games.playerTwo', 'games.playerOneScore', 'games.playerTwoScore', 'games.date'])
			.where(`games.playerOne = :login OR games.playerTwo = :login`, { login: login })
			.getMany();
		if (!history.length)
			return history;
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
		return matches;
	}
}
