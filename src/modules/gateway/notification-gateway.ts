import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/common/constants';
import { SocketToken } from 'src/common/guards/socket-token.guard';
import { SocketGateway } from './socket-gateway';

@WebSocketGateway({
    allowEIO3: true,
    cors: {
        origin: true,
        credentials: true,
    },
})
export class NotificationGateway {
    constructor(private readonly socketGateway: SocketGateway) {}

    @UseGuards(SocketToken)
    @SubscribeMessage(SocketEvent.USER_LIKE_REVIEW)
    receiveUserLikeReview(
        client: Socket & { user: { sub: string } },
        payload: {
            authorId: string;
            reviewId: string;
        },
    ) {
        console.info('receive event USER_LIKE_REVIEW: ', payload);
        const { authorId, reviewId } = payload;

        this.socketGateway.server
            .to(authorId)
            .emit(SocketEvent.USER_LIKE_REVIEW, {
                reviewId,
                actor: client.user.sub,
            });
        return;
    }
}
