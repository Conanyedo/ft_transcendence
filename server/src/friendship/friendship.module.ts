import { forwardRef, Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './friendship.entity';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';
import { NotificationModule } from 'src/header/notification/notification.module';

@Module({
  providers: [FriendshipService],
  controllers: [FriendshipController],
  imports: [TypeOrmModule.forFeature([Friendship]), forwardRef(() => UserModule), ChatModule, NotificationModule],
	exports: [FriendshipService]
})
export class FriendshipModule {}
