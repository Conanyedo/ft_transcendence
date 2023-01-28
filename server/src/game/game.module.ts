import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { FriendshipModule } from 'src/friendship/friendship.module';
import { JwtAuthModule } from 'src/2fa-jwt/jwt/jwt-auth.module';

@Module({
	providers: [GameService, GameGateway],
	controllers: [GameController],
	imports: [TypeOrmModule.forFeature([Game]), UserModule, FriendshipModule, JwtAuthModule],
})
export class GameModule { }
