import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(
		private readonly configService: ConfigService
	) { }
	catch(exception: HttpException, host: ArgumentsHost) {
		console.log("exception : ", exception);

		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		response.redirect(`http://${this.configService.get('CLIENT_IP')}`)
	}
}
