import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';

export const chatGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
});

export const createChatBodySchema = Joi.object().keys({
    receiverId: Joi.string().required(),
    content: Joi.string().required(),
});

export const messageGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
});
