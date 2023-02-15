import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from '../notification/notification.module';
import { ChatGateway } from './chat-gateway';
import { NotificationGateway } from './notification-gateway';
import { SocketGateway } from './socket-gateway';

@Module({
    imports: [JwtModule.register({}), NotificationModule, ChatModule],
    providers: [JwtService, SocketGateway, NotificationGateway, ChatGateway],
})
export class SocketModule {}
