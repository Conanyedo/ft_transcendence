import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { IntraStrategy } from './intra.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, JwtStrategy],
	imports: [UserModule, PassportModule, JwtModule.register({
		secret: 'jwtConstants.secret',
		signOptions: { expiresIn: '1d' }
	})]
})
export class AuthModule {}
