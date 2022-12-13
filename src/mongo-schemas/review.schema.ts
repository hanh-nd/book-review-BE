import { MongoCollection } from './constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoBaseSchema } from './mongo.base.schema';
import { ObjectId, Types } from 'mongoose';

@Schema({
    collection: MongoCollection.REVIEW,
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Review extends MongoBaseSchema {
    _id: string;

    @Prop({ required: true, type: String })
    content: string;

    @Prop({ required: true, type: Types.ObjectId })
    authorId: ObjectId;

    @Prop({ required: true, type: Types.ObjectId })
    bookId: ObjectId;

    @Prop({ required: false, default: [], type: [Types.ObjectId] })
    likeIds: ObjectId[];
}

const BaseReviewSchema = SchemaFactory.createForClass(Review);
export const ReviewSchema = BaseReviewSchema;
