import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { MongoCollection } from './constant';
import { MongoBaseSchema } from './mongo.base.schema';

@Schema({
    timestamps: true,
    collection: MongoCollection.MESSAGE,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Message extends MongoBaseSchema {
    _id: string;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    senderId: ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    receiverId: ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Chat' })
    chatId: ObjectId;

    @Prop({ required: true, type: String })
    content: string;
}

const BaseMessageSchema = SchemaFactory.createForClass(Message);

export const MessageSchema = BaseMessageSchema;
