import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import { ReportType } from 'src/common/constants';
import { MongoCollection } from './constant';
import { MongoBaseSchema } from './mongo.base.schema';

@Schema({
    timestamps: true,
    collection: MongoCollection.REPORT,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Report extends MongoBaseSchema {
    _id: string;

    @Prop({ required: true, type: Types.ObjectId })
    targetId: ObjectId;

    @Prop({ required: true, type: String, enum: Object.keys(ReportType) })
    type: ReportType;

    @Prop({ required: true, type: Types.ObjectId })
    reporterId: ObjectId;

    @Prop({ required: false, type: String, default: null })
    description: string;
}

const BaseReportSchema = SchemaFactory.createForClass(Report);

export const ReportSchema = BaseReportSchema;
