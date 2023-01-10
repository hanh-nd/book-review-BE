import { Module } from '@nestjs/common';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from './notification-gateway';
import { SocketGateway } from './socket-gateway';

@Module({
    imports: [JwtModule.register({})],
    providers: [JwtService, SocketGateway, NotificationGateway],
})
export class SocketModule {}
