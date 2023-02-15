import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
    ReportType,
} from 'src/common/constants';
import { ReportService } from 'src/modules/report/services/report.service';
import { Comment } from 'src/mongo-schemas/comment.schema';
import { MongoCollection } from 'src/mongo-schemas/constant';
import {
    CreateCommentBody,
    ReportCommentBody,
    UpdateCommentBody,
} from '../comment.dto';
import { ICommentGetListQuery } from '../comment.interface';
@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        private reportService: ReportService,
    ) {}

    generateMatchGetListQuery(query: ICommentGetListQuery) {
        const { reviewId, parentId = null } = query;
        const matchQuery: any = {
            parentId: parentId ? new ObjectId(parentId) : null,
        };
        if (reviewId) {
            matchQuery.reviewId = new ObjectId(reviewId);
        }
        return matchQuery;
    }

    async createComment(authorId: string, body: CreateCommentBody) {
        const { content, reviewId, parentId = null } = body;
        let depth = 0;
        if (parentId) {
            const parent = await this.findById(parentId);
            depth = parent.depth + 1;
        }
        const createdComment = await this.commentModel.create({
            content,
            reviewId: new ObjectId(reviewId),
            authorId: new ObjectId(authorId),
            parentId: parentId ? new ObjectId(parentId) : null,
            depth,
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
                    $graphLookup: {
                        from: MongoCollection.COMMENT,
                        startWith: '$_id',
                        connectFromField: '_id',
                        connectToField: 'parentId',
                        as: 'children',
                    },
                },
                {
                    $unwind: {
                        path: '$children',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: {
                        'children.depth': -1,
                        [`children.${orderBy}`]:
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
                    $lookup: {
                        from: MongoCollection.REVIEW,
                        localField: 'children.reviewId',
                        foreignField: '_id',
                        as: 'children.review',
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'children.authorId',
                        foreignField: '_id',
                        as: 'children.author',
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'children.likeIds',
                        foreignField: '_id',
                        as: 'children.likes',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        content: {
                            $first: '$content',
                        },
                        authorId: {
                            $first: '$authorId',
                        },
                        author: {
                            $first: '$author',
                        },
                        reviewId: {
                            $first: '$reviewId',
                        },
                        review: {
                            $first: '$review',
                        },
                        likeIds: {
                            $first: '$likeIds',
                        },
                        likes: {
                            $first: '$likes',
                        },
                        depth: {
                            $first: '$depth',
                        },
                        createdAt: {
                            $first: '$createdAt',
                        },
                        updatedAt: {
                            $first: '$updatedAt',
                        },
                        children: {
                            $push: '$children',
                        },
                    },
                },
                {
                    $set: {
                        children: {
                            $let: {
                                vars: {
                                    firstChild: {
                                        $arrayElemAt: ['$children', 0],
                                    },
                                },
                                in: {
                                    $let: {
                                        vars: {
                                            arrSize: {
                                                $size: '$$firstChild.review',
                                            },
                                        },
                                        in: {
                                            $cond: {
                                                if: {
                                                    $gt: ['$$arrSize', 0],
                                                },
                                                then: '$children',
                                                else: [],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        children: {
                            $reduce: {
                                input: '$children',
                                initialValue: {
                                    currentLevel: 0,
                                    currentLevelChildren: [],
                                    previousLevelChildren: [],
                                },
                                in: {
                                    $let: {
                                        vars: {
                                            prev: {
                                                $cond: {
                                                    if: {
                                                        $eq: [
                                                            '$$value.currentLevel',
                                                            '$$this.depth',
                                                        ],
                                                    },
                                                    then: '$$value.previousLevelChildren',
                                                    else: '$$value.currentLevelChildren',
                                                },
                                            },
                                            current: {
                                                $cond: {
                                                    if: {
                                                        $eq: [
                                                            '$$value.currentLevel',
                                                            '$$this.depth',
                                                        ],
                                                    },
                                                    then: '$$value.currentLevelChildren',
                                                    else: [],
                                                },
                                            },
                                        },
                                        in: {
                                            currentLevel: '$$this.depth',
                                            previousLevelChildren: '$$prev',
                                            currentLevelChildren: {
                                                $concatArrays: [
                                                    '$$current',
                                                    [
                                                        {
                                                            $mergeObjects: [
                                                                '$$this',
                                                                {
                                                                    children: {
                                                                        $filter:
                                                                            {
                                                                                input: '$$prev',
                                                                                as: 'child',
                                                                                cond: {
                                                                                    $eq: [
                                                                                        '$$child.parentId',
                                                                                        '$$this._id',
                                                                                    ],
                                                                                },
                                                                            },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        children: '$children.currentLevelChildren',
                    },
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

    async findById(commentId: string) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new NotFoundException();
        }
        return comment;
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

    async reportComment(
        reporterId: string,
        commentId: string,
        body: ReportCommentBody,
    ) {
        const { description } = body;
        const createdReport = await this.reportService.create({
            description,
            reporterId,
            targetId: commentId,
            type: ReportType.COMMENT,
        });
        return createdReport;
    }
}
