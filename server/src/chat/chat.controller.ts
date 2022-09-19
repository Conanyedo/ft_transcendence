import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }
	
	@Get('/conversations')
	@UseGuards(JwtAuthGuard)
	async getConversations(@User() user: userParitalDto) {
		// return await this.chatService.getConversations(user.login);
	}
	
	@Get('/messages/:convId')
	@UseGuards(JwtAuthGuard)
	async getMessages(@Param('convId') convid: string) {
		// return await this.chatService.getMessages(convid);
	}
}
