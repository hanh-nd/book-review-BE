import { Document } from 'mongoose';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { Book } from 'src/mongo-schemas/book.schema';

export type BookDocument = Document<Book>;

export interface IBookGetListQuery extends ICommonGetListQuery {}
