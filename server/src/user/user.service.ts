import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) { }

	async registerUser(newUser: userDto) {
		const user = new User();
		user.login = newUser.login;
		user.email = newUser.email;
		user.fullname = newUser.fullname;
		user.avatar = newUser.avatar;
		return await this.userRepository.save(user);
	}

	async getUserByEmail(email: string) {
		return await this.userRepository.findOne({ where: { email } });
	}

	async getUserById(id: string) {
		return await this.userRepository.findOne({ where: { id } });
	}

	async setUserAuthenticated(id: string) {
		const user = await this.userRepository.findOne({ where: { id } });
		user.isAuthenticated = true;
		return await this.userRepository.save(user);
	}

	async unsetUserAuthenticated(id: string) {
		const user = await this.userRepository.findOne({ where: { id } });
		user.isAuthenticated = false;
		return await this.userRepository.save(user);
	}

	async set2faSecret(id: string, secret: string) {
		const user = await this.userRepository.findOne({ where: { id } });
		user._2faSecret = secret;
		await this.userRepository.save(user);
	}

	async turnOn2fa(id: string) {
		const user = await this.userRepository.findOne({ where: { id } });
		user.is2faEnabled = true;
		await this.userRepository.save(user);
	}
}
