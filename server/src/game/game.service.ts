import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userParitalDto } from 'src/user/user.dto';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>,
	) { }

	async insertMatches(login: string) {
		const history: Game[] = await this.gameRepository
			.createQueryBuilder('games')
			.select(['games.playerOne', 'games.playerTwo', 'games.playerOneScore', 'games.playerTwoScore', 'games.date'])
			.where(`games.playerOne = :login OR games.palyerTwo = :login`, { login: login })
			.getMany();
		console.log(history);
		// if (!history)
		// 	throw new NotFoundException('User not found');
		// return { ...user };
	}

	async getMatches(login: string) {
		const history: Game[] = await this.gameRepository
			.createQueryBuilder('games')
			.select(['games.playerOne', 'games.playerTwo', 'games.playerOneScore', 'games.playerTwoScore', 'games.date'])
			.where(`games.playerOne = :login OR games.playerTwo = :login`, { login: login })
			.getMany();
		if (!history.length)
			return history;
		const matches = history.map((match) => {
			const result = {
				opponent: (match.playerOne === login) ? match.playerTwo : match.playerOne,
				yourScore: (match.playerOne === login) ? match.playerOneScore : match.playerTwoScore,
				opponentScore: (match.playerOne === login) ? match.playerTwoScore : match.playerOneScore,
				data: match.date.toLocaleDateString("en-GB")
			}
			return result;
		})
		return matches;
	}
}
