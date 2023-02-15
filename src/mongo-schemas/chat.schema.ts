import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { MongoCollection } from './constant';
import { MongoBaseSchema } from './mongo.base.schema';

@Schema({
    timestamps: true,
    collection: MongoCollection.CHAT,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Chat extends MongoBaseSchema {
    _id: string;

    @Prop({ required: false, default: [], type: [Types.ObjectId], ref: 'User' })
    memberIds: ObjectId[];

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: false, default: null, type: Date })
    lastMessageAt: Date;
}

const BaseChatSchema = SchemaFactory.createForClass(Chat);

export const ChatSchema = BaseChatSchema;
