import {
    Table,
    Column,
    Model,
    HasMany,
    CreatedAt,
    UpdatedAt,
    PrimaryKey,
    DataType,
    DeletedAt,
    BelongsTo,
    HasOne,
    BelongsToMany,
} from 'sequelize-typescript';
import Invoice from './invoice';
import UserPurchase from './user_purchase';
import Channel from './channel';
import UserSession from './userSession';

export enum UserChannelStatus {
    Private = 'private',
    Open = 'open',
    NotConnected = 'not_connected',
}

export enum UserRole {
    User = 'user',
    Admin = 'admin',
}

@Table({ tableName: 'user', underscored: true, paranoid: true })
export default class User extends Model {
    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;

    @DeletedAt
    @Column
    deletedAt: Date;

    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number;

    @Column
    pubKey: string;

    @Column
    password: string;

    @Column
    channelStatus: UserChannelStatus;

    @Column
    role: UserRole;

    @Column
    credit: number;

    // relations

    @HasMany(() => Invoice, 'userPubKey')
    invoices: Invoice[];

    @HasMany(() => UserPurchase, 'userPubKey')
    userPurchases: UserPurchase[];

    @HasMany(() => Channel, 'userPubKey')
    channels: Channel[];

    @HasOne(() => UserSession, 'userPubKey')
    session: UserSession;
}
