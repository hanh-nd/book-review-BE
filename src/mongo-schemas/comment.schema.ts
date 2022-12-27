import { MongoCollection } from './constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseSchema } from './mongo.base.schema';
import { ObjectId, Types } from 'mongoose';

@Schema({
    collection: MongoCollection.COMMENT,
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Comment extends MongoBaseSchema {
    _id: string;

    @Prop({ required: true, type: String })
    content: string;

    @Prop({ required: true, type: Types.ObjectId })
    authorId: ObjectId;

    @Prop({ required: true, type: Types.ObjectId })
    reviewId: ObjectId;

    @Prop({ required: false, type: [Types.ObjectId] })
    likeIds: ObjectId[];

    @Prop({ required: false, type: Types.ObjectId, default: null, index: true })
    parentId: ObjectId;

    @Prop({ required: false, type: Number, default: 0 })
    depth: number;
}

const BaseCommentSchema = SchemaFactory.createForClass(Comment);
export const CommentSchema = BaseCommentSchema;
