import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';

export const reviewGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
    bookId: Joi.string(),
});
export const createReviewBodySchema = Joi.object().keys({
    bookId: Joi.string().required(),
    content: Joi.string().required(),
});

export const updateReviewBodySchema = Joi.object().keys({
    content: Joi.string().required(),
});
