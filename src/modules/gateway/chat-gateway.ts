import { UseGuards } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/common/constants';
import { SocketToken } from 'src/common/guards/socket-token.guard';
import { Chat } from 'src/mongo-schemas/chat.schema';
import { Message } from 'src/mongo-schemas/message.schema';
import { ChatService } from '../chat/services/chat.service';
import { SocketGateway } from './socket-gateway';

@WebSocketGateway({
    allowEIO3: true,
    cors: {
        origin: true,
        credentials: true,
    },
})
export class ChatGateway {
    constructor(
        private readonly socketGateway: SocketGateway,
        private readonly chatService: ChatService,
    ) {}

    @UseGuards(SocketToken)
    @SubscribeMessage(SocketEvent.USER_CHAT)
    async receiveUserChat(
        client: Socket & { user: { sub: string } },
        payload: {
            receiverId: string;
            name: string;
        },
    ): Promise<WsResponse<Chat>> {
        console.info('receive event USER_CHAT: ', payload);
        const { receiverId, name } = payload;
        const senderId = client.user.sub;

        let chat: any;

        const chats = await this.chatService.getChatList({
            senderId,
            receiverId,
        });

        if (chats.length) return (chat = chats[0]);

        const createdChat = await this.chatService.create(senderId, {
            receiverId,
            name: name || Date.now().toString(),
        });

        chat = createdChat;

        this.socketGateway.server
            .to(`${senderId}`)
            .emit(SocketEvent.USER_CHAT, chat);
        return;
    }

    @UseGuards(SocketToken)
    @SubscribeMessage(SocketEvent.USER_MESSAGE)
    async receiveUserMessage(
        client: Socket & { user: { sub: string } },
        payload: {
            chatId: string;
            content: string;
        },
    ): Promise<WsResponse<Message>> {
        console.info('receive event USER_MESSAGE: ', payload);
        const { chatId, content } = payload;
        const senderId = client.user.sub;

        const chat = await this.chatService.getChatDetail(chatId);
        if (!chat) return;

        const receiver = chat.memberIds.filter(
            (m) => (m as any)._id.toString() != senderId,
        )?.[0];
        if (!receiver) return;

        console.log({
            senderId,
            chat: chat.memberIds,
            receiver,
        });

        const message = await this.chatService.createMessage({
            chatId,
            content,
            senderId,
            receiverId: (receiver as any)._id.toString(),
        });

        console.log('emitting to', (receiver as any)._id.toString(), senderId);

        this.socketGateway.server
            .to(`${(receiver as any)._id.toString()}`)
            .to(`${senderId}`)
            .emit(SocketEvent.USER_MESSAGE, message);
        return;
    }
}
