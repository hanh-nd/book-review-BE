import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/mongo-schemas/chat.schema';
import { Message, MessageSchema } from 'src/mongo-schemas/message.schema';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    providers: [JwtService, ChatService],
    controllers: [ChatController],
    exports: [ChatService],
})
export class ChatModule {}
