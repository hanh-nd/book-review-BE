import { Document } from 'mongoose';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { Chat } from 'src/mongo-schemas/chat.schema';
import { Message } from 'src/mongo-schemas/message.schema';

export type ChatDocument = Document<Chat>;

export interface IChatGetListQuery extends ICommonGetListQuery {
    senderId: string;
    receiverId: string;
}

export type MessageDocument = Document<Message>;

export interface IMessageGetListQuery extends ICommonGetListQuery {
    chatId: string;
}
