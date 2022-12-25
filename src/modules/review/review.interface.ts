import { Document } from 'mongoose';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { Review } from 'src/mongo-schemas/review.schema';

export type ReviewDocument = Document<Review>;

export interface IReviewGetListQuery extends ICommonGetListQuery {
    bookId?: string;
}
