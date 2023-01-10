import { Document } from 'mongoose';
import { NotificationAction, NotificationModule } from 'src/common/constants';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { Notification } from 'src/mongo-schemas/notification.schema';

export type NotificationDocument = Document<Notification>;

export interface INotificationGetListQuery extends ICommonGetListQuery {
    receiverId: string;
}

export interface ICreateNotificationBody {
    targetId: string;
    module: NotificationModule;
    action: NotificationAction;
    senderId: string;
    receiverId: string;
}
