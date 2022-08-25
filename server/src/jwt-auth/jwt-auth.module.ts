import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET_KEY'),
				signOptions: { expiresIn: '1d' }
			}),
			inject: [ConfigService]
		})
	],
	providers: [JwtAuthService, JwtAuthStrategy],
	exports: [JwtAuthService],
})
export class JwtAuthModule { }