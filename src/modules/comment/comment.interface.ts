import { Document } from 'mongoose';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { Comment } from 'src/mongo-schemas/comment.schema';

export type CommentDocument = Document<Comment>;

export interface ICommentGetListQuery extends ICommonGetListQuery {
    reviewId: string;
    parentId?: string;
}
