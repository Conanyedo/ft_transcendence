import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from 'src/2fa-jwt/jwt/jwt-auth.module';
import { UserModule } from 'src/user/user.module';
import { Conversation, Member, Message } from './chat.entity';
import { ChatGateway } from './chat.gateway';
import { FriendshipModule } from 'src/friendship/friendship.module';

@Module({
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
	imports: [TypeOrmModule.forFeature([Message, Conversation, Member]), JwtAuthModule, forwardRef(() =>UserModule), forwardRef(() => FriendshipModule)],
	exports: [ChatService]
})
export class ChatModule {}
