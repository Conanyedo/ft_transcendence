import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './friendship.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [FriendshipService],
  controllers: [FriendshipController],
  imports: [TypeOrmModule.forFeature([Friendship]), UserModule],
})
export class FriendshipModule {}
