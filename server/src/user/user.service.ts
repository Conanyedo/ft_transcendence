import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userDto, userParitalDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) { }

	async registerUser(newUser: userDto): Promise<userParitalDto> {
		let user: User = new User();
		user.login = newUser.login;
		user.email = newUser.email;
		user.fullname = newUser.fullname;
		user.avatar = newUser.avatar;
		user = await this.userRepository.save(user);
		const getUser: userParitalDto = {
			id: user.id,
			login: user.login
		};
		return getUser;
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
	// ------------------------------


	// User Setters
	async setUserAuthenticated(id: string, status: boolean) {
		return await this.userRepository
			.createQueryBuilder('users')
			.update({ isAuthenticated: status })
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
}
