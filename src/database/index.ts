import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

export class Database {
    public static instance: Database;
    private conn: Sequelize | null;

    private constructor() {
        this.conn = null;
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async Connect() {
        if (this.conn) {
            return;
        }
        this.conn = new Sequelize({
            dialect: 'postgres',
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT as string, 10),
            database: process.env.DB_NAME,
            models: [path.join(__dirname, './models')],
        });
        await this.conn.authenticate();
    }

    public async Close() {
        if (this.conn) {
            await this.conn.close();
        }
    }

    public async Tx(): Promise<Transaction> {
        if (!this.conn) {
            throw new Error('transaction called without active database connection');
        }
        return await this.conn.transaction();
    }
}
