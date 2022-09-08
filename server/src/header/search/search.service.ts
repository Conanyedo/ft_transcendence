import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SearchService {

	constructor(private readonly userService: UserService) { }

	async getUsers(login: string, search: string) {
		return await this.userService.searchUsers(login, search);
	}

}
