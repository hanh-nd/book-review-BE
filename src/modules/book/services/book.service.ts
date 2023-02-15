import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from 'src/mongo-schemas/book.schema';
import { IBookGetListQuery } from '../book.interface';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
} from './../../../common/constants';
import { CreateBookBody, UpdateBookBody } from './../book.dto';

@Injectable()
export class BookService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

    generateMatchGetListQuery(query: IBookGetListQuery) {
        return {};
    }

    async create(createBookBody: CreateBookBody) {
        const createdBook = await this.bookModel.create(createBookBody);
        return createdBook;
    }

    async getList(query: IBookGetListQuery) {
        try {
            const {
                page = DEFAULT_PAGE_VALUE,
                limit = DEFAULT_PAGE_LIMIT,
                orderBy = OrderBy.ID,
                orderDirection = OrderDirection.DESC,
            } = query;

            const offset = (+page - 1) * +limit;

            const [result] = await this.bookModel.aggregate([
                {
                    $match: this.generateMatchGetListQuery(query),
                },
                {
                    $skip: offset,
                },
                {
                    $limit: +limit,
                },
                {
                    $sort: {
                        [orderBy]:
                            orderDirection === OrderDirection.ASC ? 1 : -1,
                    },
                },
                {
                    $facet: {
                        items: [],
                        totalItems: [
                            {
                                $count: 'count',
                            },
                        ],
                    },
                },
            ]);
            result.totalItems = result.totalItems?.[0]?.count || 0;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string) {
        const book = await this.bookModel.findById(id);
        return book;
    }

    async update(id: string, body: UpdateBookBody) {
        const book = await this.bookModel.findByIdAndUpdate(id, body);
        return book;
    }

    async delete(id: string) {
        const result = await this.bookModel.findByIdAndDelete(id);
        return result;
    }
}
