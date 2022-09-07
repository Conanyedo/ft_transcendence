import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Module({
	providers: [NotificationGateway, NotificationService],
	controllers: [NotificationController],
	imports: [TypeOrmModule.forFeature([Notification])],
	exports: [NotificationService]
})
export class NotificationModule {}
