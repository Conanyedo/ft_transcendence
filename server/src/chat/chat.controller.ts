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

	@Get('/loginInfo/:user')
	@UseGuards(JwtAuthGuard)
	async getUserInfo(@User('login') login: string, @Param('user') user: string) {
		return await this.chatService.getUserInfo(login, user);
	}

	@Post('/createChannel')
	@UseGuards(JwtAuthGuard)
	async createChannel(@User('login') login: string, @Body() body) {
		const data: createChannelDto = { ...body };
		return await this.chatService.createChannel(login, data);
	}

	@Post('/leaveChannel')
	@UseGuards(JwtAuthGuard)
	async leaveChannel(@User('login') login: string, @Body('convId') convId: string) {
		return await this.chatService.leaveChannel(login, convId);
	}

	@Post('/joinChannel')
	@UseGuards(JwtAuthGuard)
	async joinChannel(@User('login') login: string, @Body('convId') convId: string, @Body('password') password: string) {
		return await this.chatService.joinChannel(login, convId, password, false);
	}

	@Post('/channelProfile')
	@UseGuards(JwtAuthGuard)
	async channelProfile(@User('login') login: string, @Body('convId') convId: string) {
		return await this.chatService.channelProfile(login, convId);
	}

	@Post('/setMemberStatus')
	@UseGuards(JwtAuthGuard)
	async setMemberStatus(@User('login') login: string, @Body('convId') convId: string, @Body('member') member: string, @Body('status') status: memberStatus) {
		return await this.chatService.setMemberStatus(login, convId, member, status);
	}

	@Post('/addMembers')
	@UseGuards(JwtAuthGuard)
	async addMembers(@User('login') login: string, @Body('convId') convId: string, @Body('members') members: string[]) {
		return await this.chatService.addMembers(login, convId, members);
	}

	@Post('/banMember')
	@UseGuards(JwtAuthGuard)
	async banMember(@User('login') login: string, @Body('convId') convId: string, @Body('member') member: string) {
		return await this.chatService.banMember(login, convId, member);
	}

	@Post('/muteMember')
	@UseGuards(JwtAuthGuard)
	async muteMember(@User('login') login: string, @Body('convId') convId: string, @Body('member') member: string, @Body('seconds') seconds: number) {
		return await this.chatService.muteMember(login, convId, member, seconds);
	}

	@Post('/updateChannel')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar', uploadChannelConfig))
	async updateChannel(@User('login') login: string, @Body('convId') convId: string, @UploadedFile() avatar: Express.Multer.File, @Body() body) {
		const data: updateChannelDto = { ...body, avatar: avatar.filename }
		return await this.chatService.updateChannel(login, convId, data);
	}
}
