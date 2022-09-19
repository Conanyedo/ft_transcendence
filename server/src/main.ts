import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.enableCors({
		origin: `http://${configService.get('CLIENT_IP')}`,
		credentials: true
	});

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	
	await app.listen(5000);
}
bootstrap();
