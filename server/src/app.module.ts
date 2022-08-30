import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from './config/typeorm.config';

@Module({
	imports: [UserModule, AuthModule, JwtAuthModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync(typeOrmConfigAsync)
	]
})
export class AppModule { }
