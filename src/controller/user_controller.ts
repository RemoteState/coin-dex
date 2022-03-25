import { NextFunction, Request, Response } from 'express';
import { ChannelCreatorModel, UserLoginModel, UserSignupModel } from '../types/user';
import User, { UserChannelStatus, UserRole } from '../database/models/user';
import Utils from '../utils';
import { StatusCodes } from 'http-status-codes';
import Channel from '../database/models/channel';
import { getChannel, getChannels } from 'lightning';
import { lnd } from '../config/lnd';
import { annotateModelWithIndex } from 'sequelize-typescript';
import UserSession from '../database/models/userSession';
import { Sequelize } from 'sequelize';
import { SecureRandom } from '../utils/SecureRandom';
import { Database } from '../database';
import UserPurchase from '../database/models/user_purchase';

export default class UserController {
    private static instance: UserController;

    private constructor() {}

    public static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public SignUp = async (req: Request, res: Response, next: NextFunction) => {
        const tx = await Database.getInstance().Tx();
        try {
            const userReq = req.body as UserSignupModel;
            const user = new User();

            user.role = UserRole.User;
            user.password = await Utils.HashPassword(userReq.password);
            user.pubKey = userReq.pubKey;
            if (userReq.channelStatus) {
                user.channelStatus = userReq.channelStatus;
            } else {
                user.channelStatus = UserChannelStatus.NotConnected;
            }
            await user.save({ transaction: tx });
            const session = new UserSession();
            session.userPubKey = user.pubKey;
            session.token = SecureRandom.generate(128);
            await session.save({ transaction: tx });
            await tx.commit();
            Utils.RespondJSON(res, { token: session.token }, StatusCodes.CREATED);
            return;
        } catch (e) {
            await tx.rollback();
            next(e);
        }
    };

    public Login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginReq = req.body as UserLoginModel;
            const user = await User.findOne({
                where: {
                    pubKey: loginReq.pubKey,
                },
            });
            if (!user) {
                Utils.RespondError(res, 'No user found with this pubKey', StatusCodes.UNAUTHORIZED);
                return;
            }
            const comparePass = await Utils.ComparePassword(loginReq.password, user.password);
            if (!comparePass) {
                Utils.RespondError(res, 'Invalid password', StatusCodes.UNAUTHORIZED);
                return;
            }
            const session = await UserSession.findOne({
                where: {
                    userPubKey: user.pubKey,
                },
            });
            if (session) {
                Utils.RespondJSON(res, { token: session.token }, StatusCodes.OK);
                return;
            } else {
                const newSession = new UserSession();
                newSession.userPubKey = user.pubKey;
                newSession.token = SecureRandom.generate(128);
                await newSession.save();
                Utils.RespondJSON(res, { token: newSession.token }, StatusCodes.OK);
                return;
            }
        } catch (e) {
            next(e);
        }
    };

    public GetUserPurchases = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPurchases = await UserPurchase.findAll({
                where: {
                    userPubKey: req.session.user.pubKey,
                },
                include: ['invoice'],
            });
            Utils.RespondJSON(res, userPurchases, StatusCodes.OK);
            return;
        } catch (e) {
            next(e);
        }
    };
}
