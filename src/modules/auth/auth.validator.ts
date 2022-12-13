import Joi from 'src/plugins/joi';

const AuthSchema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
};

export const registerSchema = Joi.object().keys({
    ...AuthSchema,
});

export const loginSchema = Joi.object().keys({
    ...AuthSchema,
});
