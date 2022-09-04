import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthModule } from './2fa-jwt/jwt/jwt-auth.module';
import { Jwt2faAuthModule } from './2fa-jwt/2fa/2fa-auth.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { GameModule } from './game/game.module';

@Module({
	imports: [UserModule, AuthModule, JwtAuthModule, Jwt2faAuthModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync(typeOrmConfigAsync),
		GameModule
	]
})
export class AppModule { }
