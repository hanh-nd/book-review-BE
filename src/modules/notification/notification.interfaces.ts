import { Document } from 'mongoose';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { Notification } from 'src/mongo-schemas/notification.schema';

export type NotificationDocument = Document<Notification>;

export interface INotificationGetListQuery extends ICommonGetListQuery {
    receiverId: string;
}

