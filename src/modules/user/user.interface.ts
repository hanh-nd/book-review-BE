import { Document } from 'mongoose';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { User } from 'src/mongo-schemas/user.schema';

export type UserDocument = Document<User>;

export type IUserGetListQuery = ICommonGetListQuery;
