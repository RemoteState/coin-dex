import { Joi } from 'express-validation';
import { UserChannelStatus } from '../database/models/user';

export const UserSignupValidator = {
    body: Joi.object({
        pubKey: Joi.string().required(),
        password: Joi.string().required(),
        channelStatus: Joi.string().valid('private', 'open', 'not_connected').allow(null),
    }),
};

export interface UserSignupModel {
    pubKey: string;
    password: string;
    channelStatus: UserChannelStatus;
}

export const UserLoginValidator = {
    body: Joi.object({
        pubKey: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

export interface UserLoginModel {
    pubKey: string;
    password: string;
}

export const ChannelCreatorValidator = {
    body: Joi.object({
        capacity: Joi.number().required(),
        transactionId: Joi.string().required(),
        transactionVout: Joi.number().required(),
        channelId: Joi.string().allow(null),
    }),
};

export interface ChannelCreatorModel {
    capacity: number;
    transactionId: string;
    transactionVout: number;
    channelId: string;
}
