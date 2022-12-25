import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';

export const createCommentSchema = Joi.object().keys({
    content: Joi.string().trim().required(),
    reviewId: Joi.string().trim().required(),
});

export const commentGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
    reviewId: Joi.string().trim().optional(),
});

export const updateCommentSchema = Joi.object().keys({
    content: Joi.string().trim().required(),
});
