import { Controller, Get, MessageEvent, Param, Res, Sse, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

	constructor(private readonly notifService: NotificationService) { }

	@Get()
	index(@Res() response: Response) {
		response
			.type('text/html')
			.send(readFileSync(join(__dirname, 'index.html')).toString());
	}

	@Sse('notif/:login')
	async sse(@Param('login') login: string) {
		console.log('receiver ', login);
		return await this.notifService.getNotif(login);
	}

}