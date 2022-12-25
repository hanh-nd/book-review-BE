import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { User } from 'src/mongo-schemas/user.schema';
import { CreateUserBody } from '../user.dto';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
} from './../../../common/constants';
import { MongoCollection } from './../../../mongo-schemas/constant';
import { UpdateUserBody } from './../user.dto';
import { IUserGetListQuery } from './../user.interface';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    generateMatchGetListQuery(query: IUserGetListQuery) {
        return {};
    }

    async create(createUserBody: CreateUserBody) {
        const user = await this.userModel.create(createUserBody);
        return user;
    }

    async getList(query: IUserGetListQuery) {
        const {
            page = DEFAULT_PAGE_VALUE,
            limit = DEFAULT_PAGE_LIMIT,
            orderBy = OrderBy.ID,
            orderDirection = OrderDirection.DESC,
        } = query;

        const offset = (+page - 1) * +limit;

        const [result] = await this.userModel.aggregate([
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
                $project: {
                    password: 0,
                    bookShelfIds: 0,
                    __v: 0,
                },
            },
            {
                $sort: {
                    [orderBy]: orderDirection === OrderDirection.ASC ? 1 : -1,
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

        result.totalItems = result.totalItems[0].count;
        return result;
    }

    async findByUsername(username: string) {
        const user = this.userModel.findOne({
            username,
        });
        return user;
    }

    async findById(userId: string) {
        const user = this.userModel.findById(userId);
        if (!user) throw new NotFoundException();

        return user;
    }

    async getUserDetail(keyword: string) {
        const matchQuery = ObjectId.isValid(keyword)
            ? {
                  _id: new ObjectId(keyword),
              }
            : {
                  username: keyword,
              };
        const [user] = await this.userModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $project: {
                    password: 0,
                    __v: 0,
                },
            },
            {
                $lookup: {
                    from: MongoCollection.BOOK,
                    localField: 'bookShelfIds',
                    foreignField: '_id',
                    as: 'bookShelf',
                },
            },
            {
                $limit: 1,
            },
        ]);
        return user;
    }
    async updateProfile(userId: string, updateBody: UpdateUserBody) {
        const { password } = updateBody;
        const hashedPassword = await argon2.hash(password);
        const updatedUser = await this.userModel.findByIdAndUpdate(
            {
                _id: new ObjectId(userId),
            },
            {
                ...updateBody,
                password: hashedPassword,
            },
            {
                lean: true,
                select: 'username',
            },
        );

        if (!updatedUser) throw new NotFoundException();
        return updatedUser;
    }

    async addToBookShelf(userId: string, bookId: string) {
        const toUpdateUser = await this.findById(userId);
        if (!toUpdateUser) throw new NotFoundException();

        const isBookInBookShelf = toUpdateUser.bookShelfIds.some(
            (id) => id.toString() === bookId,
        );
        const updateQuery = isBookInBookShelf
            ? {
                  $pull: {
                      bookShelfIds: {
                          $eq: new ObjectId(bookId),
                      },
                  },
              }
            : {
                  $push: {
                      bookShelfIds: new ObjectId(bookId),
                  },
              };
        await toUpdateUser.update(updateQuery);
        const updatedUser = await this.findById(toUpdateUser._id);
        return updatedUser;
    }
}
