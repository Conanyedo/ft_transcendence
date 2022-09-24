import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { FriendshipModule } from 'src/friendship/friendship.module';

@Module({
  providers: [GameService, GameGateway],
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([Game]), UserModule, FriendshipModule],
})
export class GameModule {}
