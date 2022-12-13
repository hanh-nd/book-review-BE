import { Document } from 'mongoose';
import { Comment } from 'src/mongo-schemas/comment.schema';

export type CommentDocument = Document<Comment>;
