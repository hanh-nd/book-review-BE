import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/helper/response';
import { RequestWithUser } from 'src/common/interfaces';
import { JoiValidationPipe, RemoveEmptyQueryPipe } from 'src/common/pipes';
import { IChatGetListQuery, IMessageGetListQuery } from './chat.interfaces';
import { chatGetListSchema, messageGetListSchema } from './chat.validator';
import { ChatService } from './services/chat.service';

@Controller('/chats')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('/')
    @UseGuards(AccessTokenGuard)
    async getChatList(
        @Req() req: RequestWithUser,
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(chatGetListSchema),
        )
        query: IChatGetListQuery,
    ) {
        try {
            const userId = req.user.sub;
            query.senderId = userId;
            const result = await this.chatService.getChatList(query);
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }

    @Get('/:id')
    async getChatDetail(@Param('id') id: string) {
        try {
            const chat = await this.chatService.getChatDetail(id);
            return new SuccessResponse(chat);
        } catch (error) {
            throw error;
        }
    }

    @Get('/:chatId/messages')
    async getMessageList(
        @Param('chatId') chatId: string,
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(messageGetListSchema),
        )
        query: IMessageGetListQuery,
    ) {
        try {
            query.chatId = chatId;
            const result = await this.chatService.getMessageList(query);
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }
}
