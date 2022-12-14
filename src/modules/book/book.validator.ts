import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';

export const createBookSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    imageUrl: Joi.string().trim().optional(),
    describe: Joi.string().trim().optional().allow('', null),
    author: Joi.string().trim().optional().allow('', null),
    publisher: Joi.string().trim().optional().allow('', null),
    publicationYear: Joi.number().min(0),
});

export const bookGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
});

export const updateBookSchema = Joi.object().keys({
    name: Joi.string().trim().optional(),
    imageUrl: Joi.string().trim().optional(),
    describe: Joi.string().trim().optional().allow('', null),
    author: Joi.string().trim().optional().allow('', null),
    publisher: Joi.string().trim().optional().allow('', null),
    publicationYear: Joi.number().min(0),
});
