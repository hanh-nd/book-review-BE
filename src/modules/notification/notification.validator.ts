import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';

export const notificationGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
    isRead: Joi.boolean().optional(),
});

export const updateNotificationSchema = Joi.object().keys({
    isRead: Joi.boolean().required(),
});
