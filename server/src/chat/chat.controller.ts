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

	@Get('/loginInfo/:name')
	@UseGuards(JwtAuthGuard)
	async getUserInfo(@User('login') login: string, @Param() param: nameValidate) {
		return await this.chatService.getUserInfo(login, param.name);
	}

	@Get('/channelInfo/:name')
	@UseGuards(JwtAuthGuard)
	async getChannelInfo(@User('login') login: string, @Param() param: nameValidate) {
		return await this.chatService.getChannelInfo(login, param.name);
	}

	@Post('/createChannel')
	@UseGuards(JwtAuthGuard)
	async createChannel(@User('login') login: string, @Body() data: createChannelDto) {
		return await this.chatService.createChannel(login, data);
	}

	@Post('/leaveChannel')
	@UseGuards(JwtAuthGuard)
	async leaveChannel(@User('login') login: string, @Body() id: convIdValidate) {
		return await this.chatService.leaveChannel(login, id.convId);
	}

	@Post('/joinChannel')
	@UseGuards(JwtAuthGuard)
	async joinChannel(@User('login') login: string, @Body() id: convIdValidate, @Body() data: passwordValidate) {
		return await this.chatService.joinChannel(login, id.convId, data.password, false);
	}

	@Post('/channelProfile')
	@UseGuards(JwtAuthGuard)
	async channelProfile(@User('login') login: string, @Body() id: convIdValidate) {
		return await this.chatService.channelProfile(login, id.convId);
	}

	@Post('/setMemberStatus')
	@UseGuards(JwtAuthGuard)
	async setMemberStatus(@User('login') login: string, @Body() id: convIdValidate, @Body() data: memberValidate, @Body() status: memberStatusValidate) {
		return await this.chatService.setMemberStatus(login, id.convId, data.member, status.status);
	}

	@Post('/addMembers')
	@UseGuards(JwtAuthGuard)
	async addMembers(@User('login') login: string, @Body() id: convIdValidate, @Body() data: membersValidate) {
		return await this.chatService.addMembers(login, id.convId, data.members);
	}

	@Post('/banMember')
	@UseGuards(JwtAuthGuard)
	async banMember(@User('login') login: string, @Body() id: convIdValidate, @Body() data: memberValidate) {
		return await this.chatService.banMember(login, id.convId, data.member);
	}

	@Post('/muteMember')
	@UseGuards(JwtAuthGuard)
	async muteMember(@User('login') login: string, @Body() id: convIdValidate, @Body() data: memberValidate, @Body() seconds: secondsValidate) {
		return await this.chatService.muteMember(login, id.convId, data.member, seconds.seconds);
	}

	@Post('/unmuteMember')
	@UseGuards(JwtAuthGuard)
	async unmuteMember(@User('login') login: string, @Body() id: convIdValidate, @Body() data: memberValidate) {
		return await this.chatService.unmuteMember(login, id.convId, data.member);
	}

	@Post('/updateChannel')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar', uploadChannelConfig))
	async updateChannel(@User('login') login: string, @Body() id: convIdValidate, @UploadedFile() avatar: Express.Multer.File, @Body() data: updateChannelDto) {
		data.avatar = avatar?.filename;
		return await this.chatService.updateChannel(login, id.convId, data);
	}
}
