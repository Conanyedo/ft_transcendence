import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteOldAvatar, isFileValid, resizeAvatar } from 'src/config/upload.config';
import { friendDto } from 'src/friendship/friendship.dto';
import { userRelation } from 'src/friendship/friendship.entity';
import { FriendshipService } from 'src/friendship/friendship.service';
import { opponentDto } from 'src/game/game.dto';
import { Repository } from 'typeorm';
import { Stats, userAchievements } from './stats.entity';
import { leaderBoardDto, rankDto, statsDto, userDto, userParitalDto } from './user.dto';
import { User, userStatus } from './user.entity';

const fs = require('fs');
const Jimp = require('jimp');


@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Stats)
		private statsRepository: Repository<Stats>,
		private readonly friendshipService: FriendshipService,
		private readonly configService: ConfigService
	) { }

	async registerUser(newUser: userDto): Promise<userParitalDto> {
		let stats: Stats = new Stats();
		stats.rank = await this.userRepository
			.createQueryBuilder('users')
			.getCount() + 1;
		stats = await this.statsRepository.save(stats);
		let user: User = new User();
		user.login = newUser.login;
		user.fullname = newUser.fullname;
		user.avatar = newUser.avatar;
		user.stats = stats;
		user = await this.userRepository.save(user);
		const getUser: userParitalDto = {
			id: user.id,
			login: user.login,
			isFirst: true
		};
		return getUser;
	}

	async editProfile(id: string, fullname: string, avatar: string, oldPath: string) {
		if (fullname) {
			const exist = await this.userRepository.query(`SELECT FROM users where users.fullname = '${fullname}' AND users.id != '${id}';`);
			if (exist.length)
				return { err: 'Nickname already in use' };
			await this.setName(id, fullname);
		}
		if (avatar)
			avatar = await isFileValid('users', avatar);
		if (avatar && oldPath)
			deleteOldAvatar('users', oldPath);
		if (avatar) {
			await this.setAvatar(id, `http://${this.configService.get('SERVER_IP')}/uploads/users/${avatar}`);
			resizeAvatar('users', avatar);
		}
		return { data: true }
	}

	async getUser(login: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.id'])
			.where('users.login = :login', { login: login })
			.getOne();
		if (!user)
			return user;
		return user;
	}
	async userExist(login: string, friend: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.login'])
			.where('users.login = :login', { login: friend })
			.getOne();
		if (!user)
			return { err: 'User not found' };
		const relation = await this.friendshipService.getRelation(login, friend);
		if (relation === 'blocked')
			return { err: 'Unauthorized' };
		return { data: true };
	}

	async getPartialUser(login: string): Promise<userParitalDto> {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.id', 'users.login'])
			.where('users.login = :login', { login: login })
			.getOne();
		if (!user)
			return user;
		return {
			id: user.id,
			login: user.login
		};
	}

	async getSecret(id: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users._2faSecret'])
			.where('users.id = :id', { id: id })
			.getOne();
		return user?._2faSecret;
	}

	async get2faEnabled(id: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.is2faEnabled'])
			.where('users.id = :id', { id: id })
			.getOne();
		return user?.is2faEnabled;
	}

	async getIsAuthenticated(id: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.isAuthenticated'])
			.where('users.id = :id', { id: id })
			.getOne();
		return user?.isAuthenticated;
	}

	async getUserHeader(login: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.fullname', 'users.avatar'])
			.where('users.login = :login', { login: login })
			.getOne();
		if (!user)
			return { err: 'User not found' };
		return { data: { ...user } };
	}

	async getUserInfo(login: string, id: string) {
		let relation: userRelation = userRelation.NONE;
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.login', 'users.fullname', 'users.avatar', 'users.status', 'stats.XP', 'stats.GP', 'stats.rank'])
			.where(`users.login = :id`, { id: id })
			.getOne();
		if (!user)
			return { err: 'User not found' };
		if (login !== id)
			relation = await this.friendshipService.getRelation(login, id);
		return { data: { ...user, relation } };
	}

	async getUserStats(id: string, by: string) {
		const stats: Stats[] = await this.userRepository.query(`SELECT stats."numGames", stats."gamesWon" FROM users
		JOIN stats ON users."statsId" = stats.id where users.${by} = '${id}';`);
		if (!stats.length)
			return { err: 'User not found' };
		return { data: { numGames: stats[0].numGames, gamesWon: stats[0].gamesWon } };
	}

	async getAchievements(id: string, by: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.id', 'stats.achievement'])
			.where(`users.${by} = :id`, { id: id })
			.getOne()
		if (!user)
			return { err: 'User not found' };
		return { data: { achievements: user.stats.achievement } };
	}

	async getLeaderBoard(login: string) {
		const users = await this.userRepository
			.query(`select users.login, users.fullname, users.avatar, stats.rank, stats."numGames", stats."gamesWon", stats."GP" from users join stats on users."statsId" = stats.id order by stats."GP" DESC`)
		if (!users.length)
			return { data: [...users] };
		const leaderBoard: leaderBoardDto[] = await Promise.all(users.map(async (user) => {
			const relation = await this.friendshipService.getRelation(login, user.login);
			return { login: user.login, fullname: user.fullname, avatar: user.avatar, rank: user.rank, numGames: user.numGames, gamesWon: user.gamesWon, GP: user.GP, relation: relation };
		}))
		leaderBoard.sort((a: leaderBoardDto, b: leaderBoardDto) => {
			const right: number = a.GP;
			const left: number = b.GP;
			return left - right;
		});
		return { data: [...leaderBoard] };
	}

	async searchUsers(login: string, search: string) {
		search = search.toLowerCase();
		const users: User[] = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.login', 'users.fullname', 'users.avatar'])
			.where(`LOWER(users.fullname) LIKE '%${search}%' AND users.login != :login`, { login: login })
			.getMany();
		const usersList = [];
		await Promise.all(users.map(async (user) => {
			const relation = await this.friendshipService.getRelation(login, user.login);
			if (relation !== 'blocked')
				usersList.push({ ...user, relation });
		}))
		return { data: [...usersList] };
	}

	async getOpponent(login: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.fullname', 'users.avatar'])
			.where('users.login = :login', { login: login })
			.getOne();
		if (!user)
			return user;
		const opponent: opponentDto = { fullname: user.fullname, avatar: user.avatar };
		return { ...opponent };
	}

	async getFriend(login: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.login', 'users.fullname', 'users.avatar', 'users.status'])
			.where('users.login = :login', { login: login })
			.getOne();
		if (!user)
			return user;
		const friend: friendDto = { login: user.login, fullname: user.fullname, avatar: user.avatar, status: user.status };
		return { ...friend };
	}

	async getRank() {
		const rank: rankDto[] = await this.statsRepository
			.query(`select stats.id, stats.rank, stats."GP", stats."XP" from stats order by stats."GP" DESC;`)
		return rank;
	}

	async getStats(login: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.id', 'stats.id', 'stats.XP', 'stats.GP', 'stats.numGames', 'stats.gamesWon', 'stats.rank', 'stats.achievement'])
			.where(`users.login = :login`, { login: login })
			.getOne()
		const stats: statsDto = user.stats;
		return stats;
	}

	async updateStats(stats: statsDto) {
		await this.statsRepository
			.createQueryBuilder('stats')
			.update({ XP: stats.XP, GP: stats.GP, numGames: stats.numGames, gamesWon: stats.gamesWon, rank: stats.rank, achievement: stats.achievement })
			.where('id = :id', { id: stats.id })
			.execute();
	}

	async updateRank(id: string, rank: number) {
		await this.statsRepository
			.createQueryBuilder('stats')
			.update({ rank })
			.where('id = :id', { id: id })
			.execute();
	}

	async updateAchievements(id: string, achievements: userAchievements[]) {
		await this.statsRepository
			.createQueryBuilder('stats')
			.update({ achievement: achievements })
			.where('id = :id', { id: id })
			.execute();
	}

	async setUserAuthenticated(id: string, state: boolean) {
		const status: userStatus = (state) ? userStatus.ONLINE : userStatus.OFFLINE;
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ isAuthenticated: state, status: status })
			.where('id = :id', { id: id })
			.execute();
	}

	async set2faSecret(id: string, secret: string) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ _2faSecret: secret })
			.where('id = :id', { id: id })
			.execute();
	}

	async set2faEnabled(id: string, status: boolean) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ is2faEnabled: status })
			.where('id = :id', { id: id })
			.execute();
	}

	async setAvatar(id: string, avatar: string) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ avatar: avatar })
			.where('id = :id', { id: id })
			.execute();
	}

	async setName(id: string, name: string) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ fullname: name })
			.where('id = :id', { id: id })
			.execute();
	}

	async setStatus(login: string, status: userStatus) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ status: status })
			.where('login = :login', { login: login })
			.execute();
	}

}
