import { UseGuards } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
    NotificationAction,
    NotificationModule,
    SocketEvent,
} from 'src/common/constants';
import { SocketToken } from 'src/common/guards/socket-token.guard';
import { Notification } from 'src/mongo-schemas/notification.schema';
import { NotificationService } from './services/notification.service';
import { SocketGateway } from './socket-gateway';

@WebSocketGateway({
    allowEIO3: true,
    cors: {
        origin: true,
        credentials: true,
    },
})
export class NotificationGateway {
    constructor(
        private readonly socketGateway: SocketGateway,
        private readonly notificationService: NotificationService,
    ) {}

    @UseGuards(SocketToken)
    @SubscribeMessage(SocketEvent.USER_LIKE)
    async receiveUserLike(
        client: Socket & { user: { sub: string } },
        payload: {
            authorId: string;
            targetId: string;
            module: NotificationModule;
        },
    ): Promise<WsResponse<Notification>> {
        console.info('receive event USER_LIKE: ', payload);
        const { authorId, targetId, module } = payload;
        const senderId = client.user.sub;
        const createdNotification = await this.notificationService.create({
            targetId,
            action: NotificationAction.LIKE,
            module,
            senderId,
            receiverId: authorId,
        });
        this.socketGateway.server
            .to(authorId)
            .emit(SocketEvent.USER_NOTIFICATION, createdNotification);
        return;
    }

    @UseGuards(SocketToken)
    @SubscribeMessage(SocketEvent.USER_COMMENT)
    async receiveUserComment(
        client: Socket & { user: { sub: string } },
        payload: {
            authorId: string;
            targetId: string;
            module: NotificationModule;
        },
    ): Promise<WsResponse<Notification>> {
        console.info('receive event USER_COMMENT: ', payload);
        const { authorId, targetId, module } = payload;
        const senderId = client.user.sub;
        const createdNotification = await this.notificationService.create({
            targetId,
            action: NotificationAction.LIKE,
            module,
            senderId,
            receiverId: authorId,
        });
        this.socketGateway.server
            .to(authorId)
            .emit(SocketEvent.USER_NOTIFICATION, createdNotification);
        return;
    }
}
