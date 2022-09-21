import { Body, Controller, Get, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { isFileValid, uploadChannelConfig } from 'src/config/upload.config';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { createChannelDto, updateChannelDto } from './chat.dto';
import { convType, memberStatus } from './chat.entity';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

	@Get('/loginInfo/:login')
	@UseGuards(JwtAuthGuard)
	async getFriend(@Param('login') login: string) {
		return await this.chatService.getFriend(login);
	}

	@Post('/createChannel')
	@UseGuards(JwtAuthGuard)
	async createChannel(@User() user: userParitalDto, @Body() data: createChannelDto) {
		return await this.chatService.createChannel(user.login, data);
	}

	@Post('/leaveChannel')
	@UseGuards(JwtAuthGuard)
	async leaveChannel(@User() user: userParitalDto, @Body('convId') convId: string) {

	}

	@Post('/channelProfile')
	@UseGuards(JwtAuthGuard)
	async channelProfile(@User() user: userParitalDto, @Body('convId') convId: string) {
		return await this.chatService.channelProfile(user.login, convId);
	}

	@Post('/setMemberStatus')
	@UseGuards(JwtAuthGuard)
	async setMemberStatus(@User() user: userParitalDto, @Body('convId') convId: string, @Body('member') member: string, @Body('status') status: memberStatus) {
		return await this.chatService.setMemberStatus(user.login, convId, member, status);
	}

	@Post('/addMembers')
	@UseGuards(JwtAuthGuard)
	async addMembers(@User() user: userParitalDto, @Body('convId') convId: string, @Body('members') members: string[]) {
		return await this.chatService.addMembers(user.login, convId, members);
	}

	@Post('/updateChannel')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar', uploadChannelConfig))
	async updateChannel(@User() user: userParitalDto, @Body('convId') convId: string, @UploadedFile() avatar: Express.Multer.File, @Body() body) {
		const data: updateChannelDto = { ...body, avatar: avatar?.filename }
		return await this.chatService.updateChannel(user.login, convId, data);
	}
}
