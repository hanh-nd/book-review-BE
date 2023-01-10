import { CommonListQuerySchema } from 'src/common/constants';
import Joi from 'src/plugins/joi';

export const reportGetListSchema = Joi.object().keys({
    ...CommonListQuerySchema,
    resolved: Joi.boolean().optional(),
});

export const updateReportSchema = Joi.object().keys({
    resolved: Joi.boolean().required(),
});
