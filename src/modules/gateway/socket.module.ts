import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Notification,
    NotificationSchema,
} from 'src/mongo-schemas/notification.schema';
import { NotificationGateway } from './notification-gateway';
import { NotificationService } from './services/notification.service';
import { SocketGateway } from './socket-gateway';

@Module({
    imports: [
        JwtModule.register({}),
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ]),
    ],
    providers: [
        JwtService,
        NotificationService,
        SocketGateway,
        NotificationGateway,
    ],
})
export class SocketModule {}
