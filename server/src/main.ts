import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';


async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get(ConfigService);

	app.enableCors({
		origin: `http://${configService.get('CLIENT_IP')}`,
		credentials: true
	});
	app.useStaticAssets(join(__dirname, '../'));
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	
	await app.listen(+`${configService.get('SERVER_PORT')}`);
}
bootstrap();
