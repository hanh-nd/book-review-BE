import { NotificationAction, NotificationModule } from 'src/common/constants';

export class CreateNotificationBody {
    targetId: string;
    module: NotificationModule;
    action: NotificationAction;
    senderId: string;
    receiverId: string;
}
