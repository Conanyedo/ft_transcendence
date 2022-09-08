import { Controller, Get, Param, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

	constructor(private readonly notifService: NotificationService) { }

	// @Get()
	// index(@Res() response: Response) {
	// 	response
	// 		.type('text/html')
	// 		.send(readFileSync(join(__dirname, 'index.html')).toString());
	// }

	// @Sse('notif/:login')
	// async sse(@Param('login') login: string) {
	// 	return await this.notifService.getNotif(login);
	// }

}