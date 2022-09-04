import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [GameService],
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([Game]), UserModule],
})
export class GameModule {}
