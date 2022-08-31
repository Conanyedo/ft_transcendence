import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { IntraStrategy } from './intra-auth.strategy';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtAuthModule } from 'src/2fa-jwt/jwt/jwt-auth.module';
import { Jwt2faAuthModule } from 'src/2fa-jwt/2fa/2fa-auth.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, GoogleOauthStrategy],
	imports: [UserModule, JwtAuthModule, Jwt2faAuthModule, PassportModule]
})
export class AuthModule {}
