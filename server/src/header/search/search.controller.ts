import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { searchValidate } from './search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

	constructor(private readonly searchService: SearchService) { }

	@Get('/users')
	@UseGuards(JwtAuthGuard)
	async getUsers(@User() user: userParitalDto, @Query() query: searchValidate) {
		return await this.searchService.getUsers(user.login, query.search);
	}

	@Get('/channels')
	@UseGuards(JwtAuthGuard)
	async getChannels(@User() user: userParitalDto, @Query() query: searchValidate) {
		return await this.searchService.getChannels(user.login, query.search);
	}
}
