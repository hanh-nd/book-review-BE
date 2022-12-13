import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';
export const userGetListQuerySchema = Joi.object().keys({
    ...CommonListQuerySchema,
});

export const updateUserProfileSchema = Joi.object().keys({
    password: Joi.string().required(),
});

export const addToBookShelfSchema = Joi.object().keys({
    bookId: Joi.string().required(),
});
