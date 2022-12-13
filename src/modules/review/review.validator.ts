import Joi from 'src/plugins/joi';

export const createReviewBodySchema = Joi.object().keys({
    bookId: Joi.string().required(),
    content: Joi.string().required(),
});
