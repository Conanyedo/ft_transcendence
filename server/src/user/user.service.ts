import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { friendDto } from 'src/friendship/friendship.dto';
import { userRelation } from 'src/friendship/friendship.entity';
import { FriendshipService } from 'src/friendship/friendship.service';
import { opponentDto } from 'src/game/game.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Stats, userAchievements } from './stats.entity';
import { userDto, userParitalDto } from './user.dto';
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
		private readonly friendshipService: FriendshipService
	) { }

	async registerUser(newUser: userDto): Promise<userParitalDto> {
		const stats: Stats = new Stats();
		stats.rank = await this.userRepository
			.createQueryBuilder('users')
			.getCount() + 1;
		// stats.achievement = [userAchievements.FIRSTPLACE, userAchievements.GOLDTIER, userAchievements.WON20];
		let user: User = new User();
		user.login = newUser.login;
		user.fullname = newUser.fullname;
		user.avatar = newUser.avatar;
		user.stats = stats;
		this.statsRepository.save(stats);
		user = await this.userRepository.save(user);
		const getUser: userParitalDto = {
			id: user.id,
			login: user.login
		};
		return getUser;
	}

	// Edit Profile
	async editProfile(id: string, fullname: string, avatar: string, oldPath: string) {
		if (fullname)
			await this.setName(id, fullname);
		if (oldPath) {
			let oldName = oldPath.split('/').pop();
			oldName = oldName.slice(0, oldName.indexOf('.jpg'));
			fs.unlink(`../client/public/uploads/users/${oldName}x70.jpg`, (err) => { });
			fs.unlink(`../client/public/uploads/users/${oldName}x220.jpg`, (err) => { });
		}
		if (avatar) {
			await this.setAvatar(id, `/uploads/users/${avatar}`);
			const image = await Jimp.read(`../client/public/uploads/users/${avatar}`);
			const resizeName = avatar.slice(0, avatar.indexOf('.jpg'));
			image.resize(220, 220).write(`../client/public/uploads/users/${resizeName}x220.jpg`);
			image.resize(70, 70).write(`../client/public/uploads/users/${resizeName}x70.jpg`);
			fs.unlink(`../client/public/uploads/users/${avatar}`, (err) => { });
		}
	}

	// User Getters
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

	async getSocketId(login: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.socketId'])
			.where('users.login = :login', { login: login })
			.getOne();
		return user?.socketId;
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

	async getUserHeader(id: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.fullname', 'users.avatar'])
			.where('users.id = :id', { id: id })
			.getOne();
		if (!user)
			throw new NotFoundException('User not found');
		return { ...user };
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
			throw new NotFoundException('User not found');
		if (login !== id)
			relation = await this.friendshipService.getRelation(login, id);
		return { ...user, relation };
	}

	async getUserStats(id: string, by: string) {
		const stats: Stats[] = await this.userRepository.query(`SELECT stats."numGames", stats."gamesWon" FROM users
		JOIN stats ON users."statsId" = stats.id where users.${by} = '${id}';`);
		if (!stats.length)
			throw new NotFoundException('User not found');
		return { numGames: stats[0].numGames, gamesWon: stats[0].gamesWon };
	}

	async getAchievements(id: string, by: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.id', 'stats.achievement'])
			.where(`users.${by} = :id`, { id: id })
			.getOne()
		if (!user)
			throw new NotFoundException('User not found');
		return { achievements: user.stats.achievement };
	}

	async getLeaderBoard(login: string) {
		const users: User[] = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.login', 'users.fullname', 'users.avatar', 'stats.rank', 'stats.numGames', 'stats.gamesWon', 'stats.GP'])
			.orderBy('stats.GP', 'DESC')
			.getMany();
		const leaderBoard = await Promise.all(users.map(async (user) => {
			const relation = await this.friendshipService.getRelation(login, user.login);
			return { ...user, relation }
		}))
		return [...leaderBoard];
	}

	async searchUsers(login: string, search: string) {
		search = search.toLowerCase();
		const users: User[] = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.login', 'users.fullname', 'users.avatar'])
			.where(`LOWER(users.fullname) LIKE '%${search}%' AND users.login != :login`, { login: login })
			.getMany();
		const usersList = await Promise.all(users.map(async (user) => {
			const relation = await this.friendshipService.getRelation(login, user.login);
			if (relation !== 'blocked')
				return { ...user, relation }
		}))
		return [...usersList];
	}

	async getOpponent(login: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.fullname', 'users.avatar'])
			.where('users.login = :login', { login: login })
			.getOne();
		if (!user)
			throw new NotFoundException('User not found');
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
			throw new NotFoundException('User not found');
		const friend: friendDto = { login: user.login, fullname: user.fullname, avatar: user.avatar, status: user.status };
		return { ...friend };
	}
	// ------------------------------


	// User Setters
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

	async setStatus(id: string, status: userStatus) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ status: status })
			.where('id = :id', { id: id })
			.execute();
	}

	async setSocketId(id: string, value: string | null) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ socketId: value })
			.where('id = :id', { id: id })
			.execute();
	}
}
