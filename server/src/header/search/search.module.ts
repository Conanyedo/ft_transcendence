import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/2fa-jwt/jwt/jwt-auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { UserModule } from 'src/user/user.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
	imports: [UserModule, JwtAuthModule, ChatModule]
})
export class SearchModule {}
