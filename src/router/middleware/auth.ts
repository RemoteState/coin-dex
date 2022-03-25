import { NextFunction, Request, Response } from 'express';
import Utils from '../../utils';
import { StatusCodes } from 'http-status-codes';
import UserSession from '../../database/models/userSession';
import { UserRole } from '../../database/models/user';

// logger key mapping, declaration merging for request
declare global {
    namespace Express {
        // tslint:disable-next-line:interface-name
        interface Request {
            session: UserSession;
        }
    }
}

export const validateAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('x-api-key');
    if (!token) {
        Utils.RespondError(res, 'missing auth header key', StatusCodes.NOT_ACCEPTABLE);
        return;
    }
    const session = await UserSession.findOne({
        where: {
            token,
        },
        include: ['user'],
    });
    if (!session) {
        Utils.RespondError(res, 'unauthorized request', StatusCodes.UNAUTHORIZED);
        return;
    }
    // set to express request
    req.session = session;
    next();
};

export const allowRoles = (perm: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.session) {
            Utils.RespondError(res, 'missing permission', StatusCodes.UNAUTHORIZED);
            return;
        }
        if (req.session.user.role === UserRole.Admin) {
            next();
            return;
        }
        const have = perm.find((p) => p === req.session.user.role);
        if (!have) {
            Utils.RespondError(res, 'missing permission', StatusCodes.UNAUTHORIZED);
            return;
        }
        next();
    };
};
