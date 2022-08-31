import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Jwt2faAuthService } from './2fa-auth.service';
import { Jwt2faAuthStrategy } from './2fa-auth.strategy';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('2FA_JWT_SECRET_KEY'),
				signOptions: { expiresIn: 60 * 5 }
			}),
			inject: [ConfigService]
		}),
	],
	providers: [Jwt2faAuthService, Jwt2faAuthStrategy],
	exports: [Jwt2faAuthService],
})
export class Jwt2faAuthModule { }