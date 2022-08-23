import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/createUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) { }

	async doUserRegistration(userRegister: createUserDto) {
		const user = new User();
		user.id = userRegister.id;
		user.login = userRegister.login;
		user.email = userRegister.email;
		user.fullname = userRegister.fullname;
		user.avatar = userRegister.avatar;
		const newUser = await this.userRepository.save(user);

		return newUser;
	}

	async getUserById(id: number) {
		return await this.userRepository.findOne({ where: { id } });
	}
}
