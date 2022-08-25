import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { IntraStrategy } from './intra-auth.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';
import { GoogleOauthStrategy } from './google-oauth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, GoogleOauthStrategy],
	imports: [UserModule, JwtAuthModule, PassportModule]
})
export class AuthModule {}
