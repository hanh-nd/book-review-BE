import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Notification,
    NotificationSchema,
} from 'src/mongo-schemas/notification.schema';
import { NotificationController } from './notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ]),
    ],
    providers: [NotificationService],
    controllers: [NotificationController],
    exports: [NotificationService],
})
export class NotificationModule {}
