import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
} from 'src/common/constants';
import { Comment } from 'src/mongo-schemas/comment.schema';
import { MongoCollection } from 'src/mongo-schemas/constant';
import { CreateCommentBody, UpdateCommentBody } from '../comment.dto';
import { ICommentGetListQuery } from '../comment.interface';
@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
    ) {}

    generateMatchGetListQuery(query: ICommentGetListQuery) {
        const { reviewId } = query;
        const matchQuery: any = {};
        if (reviewId) {
            matchQuery.reviewId = new ObjectId(reviewId);
        }
        return matchQuery;
    }

    async createComment(authorId: string, body: CreateCommentBody) {
        const { content, reviewId } = body;
        const createdComment = await this.commentModel.create({
            content,
            reviewId: new ObjectId(reviewId),
            authorId: new ObjectId(authorId),
        });
        return createdComment;
    }

    async getCommentList(query: ICommentGetListQuery) {
        try {
            const {
                page = DEFAULT_PAGE_VALUE,
                limit = DEFAULT_PAGE_LIMIT,
                orderBy = OrderBy.ID,
                orderDirection = OrderDirection.DESC,
            } = query;

            const offset = (+page - 1) * +limit;

            const [result] = await this.commentModel.aggregate([
                {
                    $match: this.generateMatchGetListQuery(query),
                },
                {
                    $skip: offset,
                },
                {
                    $sort: {
                        [orderBy]:
                            orderDirection === OrderDirection.ASC ? 1 : -1,
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.REVIEW,
                        localField: 'reviewId',
                        foreignField: '_id',
                        as: 'review',
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'authorId',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'likeIds',
                        foreignField: '_id',
                        as: 'likes',
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
        } catch (error) {
            throw error;
        }
    }

    async updateComment(commentId: string, body: UpdateCommentBody) {
        const comment = await this.commentModel.findByIdAndUpdate(
            commentId,
            body,
        );
        return comment;
    }

    async react(commentId: string, userId: string) {
        const toUpdateComment = await this.commentModel.findById(commentId);
        if (!toUpdateComment) throw new NotFoundException();

        const isUserLiked = toUpdateComment.likeIds.some(
            (id) => id.toString() === userId,
        );

        const updateQuery = isUserLiked
            ? {
                  $pull: {
                      likeIds: {
                          $eq: new ObjectId(userId),
                      },
                  },
              }
            : {
                  $push: {
                      likeIds: new ObjectId(userId),
                  },
              };

        await toUpdateComment.update(updateQuery);
        return toUpdateComment;
    }

    async deleteComment(commentId: string) {
        const result = await this.commentModel.findByIdAndDelete(commentId);
        return result;
    }
}
