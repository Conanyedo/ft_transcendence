import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Stats, userAchievements } from './stats.entity';
import { userDto, userParitalDto } from './user.dto';
import { User, userStatus } from './user.entity';


@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Stats)
		private statsRepository: Repository<Stats>,
	) { }

	async registerUser(newUser: userDto): Promise<userParitalDto> {
		const stats: Stats = new Stats();
		stats.rank = await this.userRepository
			.createQueryBuilder('users')
			.getCount() + 1;
		// stats.achievement = [userAchievements.FIRSTPLACE, userAchievements.GOLDTIER, userAchievements.WON20];
		let user: User = new User();
		user.login = newUser.login;
		user.email = newUser.email;
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
	async editProfile(id: string, fullname: string, avatar: string) {

		if (fullname)
			await this.setName(id, fullname);
		if (avatar)
			await this.setAvatar(id, `/uploads/${avatar}`);
	}

	// User Getters
	async getPartialUser(email: string): Promise<userParitalDto> {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.id', 'users.login'])
			.where('users.email = :email', { email: email })
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
		return user._2faSecret;
	}

	async get2faEnabled(id: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.is2faEnabled'])
			.where('users.id = :id', { id: id })
			.getOne();
		return user.is2faEnabled;
	}

	async getIsAuthenticated(id: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.select(['users.isAuthenticated'])
			.where('users.id = :id', { id: id })
			.getOne();
		return user.isAuthenticated;
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

	async getUserInfo(id: string, by: string) {
		const user: User = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.login', 'users.fullname', 'users.avatar', 'stats.XP', 'stats.GP', 'stats.rank'])
			.where(`users.${by} = :id`, { id: id })
			.getOne();
		if (!user)
			throw new NotFoundException('User not found');
		return { ...user };
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

	async getLeaderBoard() {
		const users: User[] = await this.userRepository
			.createQueryBuilder('users')
			.leftJoinAndSelect("users.stats", "stats")
			.select(['users.login', 'users.fullname', 'users.avatar', 'stats.rank', 'stats.numGames', 'stats.gamesWon', 'stats.GP'])
			// .orderBy('stats.GP', 'DESC')
			// .take(10)
			.getMany();

		return [...users];
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
}
