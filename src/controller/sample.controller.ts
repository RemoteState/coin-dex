import { NextFunction, Request, Response } from 'express';
import Utils from '../utils';
import { StatusCodes } from 'http-status-codes';
import { ISampleBody } from '../types/sample';

export default class SampleController {
    private static instance: SampleController;
    private constructor() {}

    public static getInstance(): SampleController {
        if (!SampleController.instance) {
            SampleController.instance = new SampleController();
        }
        return SampleController.instance;
    }

    public async GetSayHello(req: Request, res: Response, next: NextFunction) {
        try {
            Utils.RespondJSON(
                res,
                {
                    message: 'Hello',
                },
                StatusCodes.OK
            );
        } catch (e) {
            next(e);
        }
    }

    public async PostSayHello(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as ISampleBody;
            Utils.RespondJSON(
                res,
                {
                    message: `hello ${body.name}`,
                },
                StatusCodes.OK
            );
        } catch (e) {
            next(e);
        }
    }
}
