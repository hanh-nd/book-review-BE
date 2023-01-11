import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';

export const notificationGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
    receiverId: Joi.string().required(),
    isRead: Joi.boolean().optional(),
});

export const updateNotificationSchema = Joi.object().keys({
    isRead: Joi.boolean().required(),
});
