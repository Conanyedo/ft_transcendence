import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserModule } from 'src/user/user.module';
import { Jwt2faAuthStrategy } from './2fa-auth.strategy';

@Module({
	imports: [
		JwtModule.register({}),
	UserModule],
	providers: [JwtAuthService, JwtAuthStrategy, Jwt2faAuthStrategy],
	exports: [JwtAuthService],
})
export class JwtAuthModule { }