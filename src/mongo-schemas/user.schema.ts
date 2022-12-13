import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { MongoCollection } from './constant';

@Schema({
    timestamps: true,
    collection: MongoCollection.USER,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class User {
    _id: string;

    @Prop({ required: true, unique: true, type: String })
    username: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: false, type: Date })
    createdAt: string;

    @Prop({ required: false, default: null, type: Date })
    updatedAt: Date;

    @Prop({ required: false, default: null, type: Date })
    deletedAt?: Date;

    @Prop({ required: false, default: [], type: [Types.ObjectId] })
    bookShelfIds: ObjectId[];
}

const BaseUserSchema = SchemaFactory.createForClass(User);
export const UserSchema = BaseUserSchema;
