import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';

export default class Utils {
    public static async HashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 8);
    }

    public static async ComparePassword(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    public static RespondJSON(res: Response, body: any, statusCode: number) {
        res.status(statusCode).send({
            status: getReasonPhrase(statusCode),
            data: body,
            error: null,
        });
    }

    public static RespondError(res: Response, err: string, statusCode?: number) {
        const code = statusCode ? statusCode : 500;
        res.status(code).send({
            status: getReasonPhrase(code),
            data: null,
            error: err,
        });
    }
}
