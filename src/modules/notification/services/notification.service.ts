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
import { MongoCollection } from 'src/mongo-schemas/constant';
import { Notification } from 'src/mongo-schemas/notification.schema';
import {
    CreateNotificationBody,
    UpdateNotificationBody,
} from '../notification.dto';
import { INotificationGetListQuery } from '../notification.interfaces';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<Notification>,
    ) {}

    generateMatchGetListQuery(query: INotificationGetListQuery) {
        const { receiverId, isRead } = query;
        const matchQuery: any = {};
        if (receiverId) {
            matchQuery.receiverId = new ObjectId(receiverId);
        }
        if (isRead) {
            matchQuery.isRead = isRead;
        }
        return matchQuery;
    }

    async create(createNotificationBody: CreateNotificationBody) {
        const { targetId, senderId, receiverId } = createNotificationBody;
        const createdNotification = await this.notificationModel.create({
            ...createNotificationBody,
            targetId: new ObjectId(targetId),
            senderId: new ObjectId(senderId),
            receiverId: new ObjectId(receiverId),
        });
        return createdNotification;
    }

    async getList(query: INotificationGetListQuery) {
        try {
            const {
                page = DEFAULT_PAGE_VALUE,
                limit = DEFAULT_PAGE_LIMIT,
                orderBy = OrderBy.ID,
                orderDirection = OrderDirection.DESC,
            } = query;

            const offset = (+page - 1) * +limit;

            const [result] = await this.notificationModel.aggregate([
                {
                    $match: this.generateMatchGetListQuery(query),
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
            result.totalItems = result.totalItems[0].count;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getDetail(id: string) {
        const result = await this.notificationModel
            .findById(id)
            .populate('targetId')
            .populate('senderId')
            .populate('receiverId')
            .exec();
        return result;
    }

    async update(id: string, body: UpdateNotificationBody) {
        const result = await this.notificationModel.findByIdAndUpdate(id, body);
        return result;
    }
}
