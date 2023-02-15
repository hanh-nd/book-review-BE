import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
} from 'src/common/constants';
import { Chat } from 'src/mongo-schemas/chat.schema';
import { MongoCollection } from 'src/mongo-schemas/constant';
import { Message } from 'src/mongo-schemas/message.schema';
import { CreateChatBody, CreateMessageBody } from '../chat.dto';
import { IChatGetListQuery, IMessageGetListQuery } from '../chat.interfaces';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name)
        private messageModel: Model<Message>,
        @InjectModel(Chat.name)
        private chatModel: Model<Chat>,
    ) {}

    generateMatchGetChatListQuery(query: IChatGetListQuery) {
        const { senderId, receiverId } = query;
        const matchQuery: any = {};

        if (senderId && receiverId) {
            matchQuery.memberIds = {
                $in: [new ObjectId(senderId), new ObjectId(receiverId)],
            };
        }

        return matchQuery;
    }

    async create(senderId: string, createChatBody: CreateChatBody) {
        const { receiverId } = createChatBody;
        const createdChat = await this.chatModel.create({
            ...createChatBody,
            memberIds: [new ObjectId(senderId), new ObjectId(receiverId)],
        });
        const chat = this.getChatDetail(createdChat._id);
        return chat;
    }

    async getChatList(query: IChatGetListQuery) {
        try {
            const {
                page = DEFAULT_PAGE_VALUE,
                limit = DEFAULT_PAGE_LIMIT,
                orderBy = OrderBy.CREATED_AT,
                orderDirection = OrderDirection.DESC,
            } = query;

            const offset = (+page - 1) * +limit;

            const [result] = await this.chatModel.aggregate([
                {
                    $match: this.generateMatchGetChatListQuery(query),
                },
                {
                    $skip: offset,
                },
                {
                    $limit: +limit,
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'memberIds',
                        foreignField: '_id',
                        as: 'members',
                    },
                },
                {
                    $sort: {
                        [orderBy]:
                            orderDirection === OrderDirection.ASC ? 1 : -1,
                        lastMessageAt: -1,
                    },
                },
                {
                    $facet: {
                        items: [],
                        totalItems: [
                            {
                                $count: 'count',
                            },
                        ],
                    },
                },
            ]);
            result.totalItems = result.totalItems?.[0]?.count || 0;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getChatDetail(id: string) {
        const result = await this.chatModel
            .findById(id)
            .populate('memberIds')
            .exec();
        return result;
    }

    generateMatchGetMessageListQuery(query: IMessageGetListQuery) {
        const { chatId } = query;
        const matchQuery: any = {};

        if (chatId) {
            matchQuery.chatId = new ObjectId(chatId);
        }

        return matchQuery;
    }

    async createMessage(createMessageBody: CreateMessageBody) {
        const { senderId, receiverId, chatId } = createMessageBody;
        const createdMessage = await this.messageModel.create({
            ...createMessageBody,
            senderId: new ObjectId(senderId),
            receiverId: new ObjectId(receiverId),
            chatId: new ObjectId(chatId),
        });
        return createdMessage;
    }

    async getMessageList(query: IMessageGetListQuery) {
        try {
            const {
                page = DEFAULT_PAGE_VALUE,
                limit = DEFAULT_PAGE_LIMIT,
                orderBy = OrderBy.CREATED_AT,
                orderDirection = OrderDirection.ASC,
            } = query;

            const offset = (+page - 1) * +limit;

            const [result] = await this.messageModel.aggregate([
                {
                    $match: this.generateMatchGetMessageListQuery(query),
                },
                {
                    $skip: offset,
                },
                {
                    $limit: +limit,
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'senderId',
                        foreignField: '_id',
                        as: 'sender',
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'receiverId',
                        foreignField: '_id',
                        as: 'receiver',
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.CHAT,
                        localField: 'chatId',
                        foreignField: '_id',
                        as: 'chat',
                    },
                },
                {
                    $sort: {
                        [orderBy]:
                            orderDirection === OrderDirection.ASC ? 1 : -1,
                    },
                },
                {
                    $facet: {
                        items: [],
                        totalItems: [
                            {
                                $count: 'count',
                            },
                        ],
                    },
                },
            ]);
            result.totalItems = result.totalItems?.[0]?.count || 0;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getMessageDetail(id: string) {
        const result = await this.messageModel
            .findById(id)
            .populate('senderId')
            .populate('receiverId')
            .populate('chatId')
            .exec();
        return result;
    }
}
