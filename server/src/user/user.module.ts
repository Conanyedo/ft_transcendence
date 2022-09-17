import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Stats } from './stats.entity';
import { JwtAuthModule } from 'src/2fa-jwt/jwt/jwt-auth.module';
import { FriendshipModule } from 'src/friendship/friendship.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, Stats]), JwtAuthModule, FriendshipModule],
  exports: [UserService]
})
export class UserModule {}