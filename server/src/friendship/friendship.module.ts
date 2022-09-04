import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './friendship.entity';

@Module({
  providers: [FriendshipService],
  controllers: [FriendshipController],
  imports: [TypeOrmModule.forFeature([Friendship])],
})
export class FriendshipModule {}
