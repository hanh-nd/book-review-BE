import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import { NotificationModule } from 'src/common/constants';
import { NotificationAction } from './../common/constants';
import { MongoCollection } from './constant';
import { MongoBaseSchema } from './mongo.base.schema';

@Schema({
    timestamps: true,
    collection: MongoCollection.NOTIFICATION,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Notification extends MongoBaseSchema {
    _id: string;

    @Prop({ required: true, type: Types.ObjectId })
    targetId: ObjectId;

    @Prop({
        required: true,
        type: String,
        enum: Object.keys(NotificationModule),
    })
    module: NotificationModule;

    @Prop({
        required: true,
        type: String,
        enum: Object.keys(NotificationAction),
    })
    action: NotificationAction;

    @Prop({ required: true, type: Types.ObjectId })
    senderId: ObjectId;

    @Prop({ required: true, type: Types.ObjectId })
    receiverId: ObjectId;

    @Prop({ required: false, type: Boolean, default: false })
    isRead: boolean;
}

const BaseNotificationSchema = SchemaFactory.createForClass(Notification);

export const NotificationSchema = BaseNotificationSchema;
