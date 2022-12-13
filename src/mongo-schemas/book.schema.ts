import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoCollection } from './constant';
import { MongoBaseSchema } from './mongo.base.schema';

@Schema({
    timestamps: true,
    collection: MongoCollection.BOOK,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Book extends MongoBaseSchema {
    _id: string;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({
        required: false,
        default: `https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Placeholder_book.svg/464px-Placeholder_book.svg.png?20071129174344`,
        type: String,
    })
    imageUrl: string;

    @Prop({ required: false, default: null, type: String })
    describe: string;

    @Prop({ required: false, default: null, type: String })
    author: string;

    @Prop({ required: false, default: null, type: String })
    publisher: string;

    @Prop({ required: false, default: null, type: Number })
    publicationYear: number;
}

const BaseBookSchema = SchemaFactory.createForClass(Book);

export const BookSchema = BaseBookSchema;
