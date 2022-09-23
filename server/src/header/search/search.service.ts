import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SearchService {

	constructor(
		private readonly userService: UserService,
		private readonly chatService: ChatService
	) { }

	async getUsers(login: string, search: string) {
		return await this.userService.searchUsers(login, search);
	}

	async getChannels(login: string, search: string) {
		return await this.chatService.searchChannels(login, search);
	}

}
