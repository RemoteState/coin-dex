import request from 'supertest';
import { app } from '../../server';
import { Database } from '../../database';

describe('GET /health - a simple api endpoint', () => {
    beforeAll(async () => {
        await Database.getInstance().Connect();
    });
    afterAll(async () => {
        await Database.getInstance().Close();
    });
    it('Health API Request', async () => {
        const result = await request(app).get('/api/v1');
        expect(result.statusCode).toEqual(200);
        expect(result.body.status).toBe('OK');
        expect(result.body.data.status).toBe('running');
        expect(result.body.error).toBe(null);
    });
});
