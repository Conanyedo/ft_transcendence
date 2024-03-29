import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { uploadChannelConfig } from 'src/config/upload.config';
import { User } from 'src/user/user.decorator';
import { convIdValidate, createChannelDto, memberStatusValidate, membersValidate, memberValidate, nameValidate, passwordValidate, secondsValidate, updateChannelDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

	@Get('conversations')
	@UseGuards(JwtAuthGuard)
	async getConversations(@User('login') login: string) {
		return await this.chatService.getConversations(login);
	}

	@Get('conversations/:convId')
	@UseGuards(JwtAuthGuard)
	async getConversationById(@User('login') login: string, @Param() id: convIdValidate) {
		return await this.chatService.getConversation(login, id.convId);
	}

	@Get('/loginInfo/:name')
	@UseGuards(JwtAuthGuard)
	async getUserInfo(@User('login') login: string, @Param() param: nameValidate) {
		return await this.chatService.getUserInfo(login, param.name);
	}

	@Get('/channelInfo/:convId')
	@UseGuards(JwtAuthGuard)
	async getChannelInfo(@User('login') login: string, @Param() id: convIdValidate) {
		return await this.chatService.getChannelInfo(login, id.convId);
	}

	@Get('/unreadMsgs')
	@UseGuards(JwtAuthGuard)
	async getUnreadMsgs(@User('login') login: string) {
		return await this.chatService.getAllUnreads(login);
	}

	@Post('/createChannel')
	@UseGuards(JwtAuthGuard)
	async createChannel(@User('login') login: string, @Body() data: createChannelDto) {
		return await this.chatService.createChannel(login, data);
	}

	@Post('/leaveChannel/:convId')
	@UseGuards(JwtAuthGuard)
	async leaveChannel(@User('login') login: string, @Param() id: convIdValidate) {
		return await this.chatService.leaveChannel(login, id.convId);
	}

	@Post('/joinChannel/:convId')
	@UseGuards(JwtAuthGuard)
	async joinChannel(@User('login') login: string, @Param() id: convIdValidate, @Body() data: passwordValidate) {
		return await this.chatService.joinChannel(login, id.convId, data.password, false);
	}

	@Post('/channelProfile/:convId')
	@UseGuards(JwtAuthGuard)
	async channelProfile(@User('login') login: string, @Param() id: convIdValidate) {
		return await this.chatService.channelProfile(login, id.convId);
	}

	@Post('/setMemberStatus/:convId')
	@UseGuards(JwtAuthGuard)
	async setMemberStatus(@User('login') login: string, @Param() id: convIdValidate, @Body() data: memberValidate, @Body() status: memberStatusValidate) {
		return await this.chatService.setMemberStatus(login, id.convId, data.member, status.status);
	}

	@Post('/addMembers/:convId')
	@UseGuards(JwtAuthGuard)
	async addMembers(@User('login') login: string, @Param() id: convIdValidate, @Body() data: membersValidate) {
		return await this.chatService.addMembers(login, id.convId, data.members);
	}

	@Post('/banMember/:convId')
	@UseGuards(JwtAuthGuard)
	async banMember(@User('login') login: string, @Param() id: convIdValidate, @Body() data: memberValidate) {
		return await this.chatService.banMember(login, id.convId, data.member);
	}

	@Post('/muteMember/:convId')
	@UseGuards(JwtAuthGuard)
	async muteMember(@User('login') login: string, @Param() id: convIdValidate, @Body() data: memberValidate, @Body() seconds: secondsValidate) {
		return await this.chatService.muteMember(login, id.convId, data.member, seconds.seconds);
	}

	@Post('/unmuteMember/:convId')
	@UseGuards(JwtAuthGuard)
	async unmuteMember(@User('login') login: string, @Param() id: convIdValidate, @Body() data: memberValidate) {
		return await this.chatService.unmuteMember(login, id.convId, data.member);
	}

	@Post('/updateChannel/:convId')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar', uploadChannelConfig))
	async updateChannel(@User('login') login: string, @Param() id: convIdValidate, @UploadedFile() avatar: Express.Multer.File, @Body() data: updateChannelDto) {
		data.avatar = avatar?.filename;
		return await this.chatService.updateChannel(login, id.convId, data);
	}
}
