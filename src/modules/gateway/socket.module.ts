import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';
import { NotificationGateway } from './notification-gateway';
import { SocketGateway } from './socket-gateway';

@Module({
    imports: [JwtModule.register({}), NotificationModule],
    providers: [JwtService, SocketGateway, NotificationGateway],
})
export class SocketModule {}
