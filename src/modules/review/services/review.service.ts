import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ReportService } from 'src/modules/report/services/report.service';
import { MongoCollection } from 'src/mongo-schemas/constant';
import { Review } from 'src/mongo-schemas/review.schema';
import { IReviewGetListQuery } from '../review.interface';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
    ReportType,
} from './../../../common/constants';
import {
    CreateReviewBody,
    ReportReviewBody,
    UpdateReviewBody,
} from './../review.dto';
@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        private reportService: ReportService,
    ) {}

    generateMatchGetListQuery(query: IReviewGetListQuery) {
        const { bookId } = query;
        const matchQuery: any = {};
        if (bookId) {
            matchQuery.bookId = new ObjectId(bookId);
        }
        return matchQuery;
    }

    async create(authorId: string, createReviewBody: CreateReviewBody) {
        const { bookId, content } = createReviewBody;
        const createdReview = await this.reviewModel.create({
            authorId: new ObjectId(authorId),
            content,
            bookId: new ObjectId(bookId),
        });
        return createdReview;
    }

    async getReviewList(query: IReviewGetListQuery) {
        try {
            const {
                page = DEFAULT_PAGE_VALUE,
                limit = DEFAULT_PAGE_LIMIT,
                orderBy = OrderBy.ID,
                orderDirection = OrderDirection.DESC,
            } = query;

            const offset = (+page - 1) * +limit;

            const [result] = await this.reviewModel.aggregate([
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
                        from: MongoCollection.BOOK,
                        localField: 'bookId',
                        foreignField: '_id',
                        as: 'book',
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

    async getReviewDetail(reviewId: string) {
        const [review] = await this.reviewModel.aggregate([
            {
                $match: {
                    _id: new ObjectId(reviewId),
                },
            },
            {
                $lookup: {
                    from: MongoCollection.BOOK,
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
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
        ]);
        return review;
    }

    async update(reviewId: string, body: UpdateReviewBody) {
        const review = await this.reviewModel.findByIdAndUpdate(reviewId, body);
        return review;
    }

    async react(reviewId: string, userId: string) {
        const toUpdateReview = await this.reviewModel.findById(reviewId);
        if (!toUpdateReview) throw new NotFoundException();
        const isUserLiked = toUpdateReview.likeIds.some(
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

        await toUpdateReview.update(updateQuery);
        return toUpdateReview;
    }

    async delete(reviewId: string) {
        const result = await this.reviewModel.findByIdAndDelete(reviewId);
        return result;
    }

    async reportReview(
        reporterId: string,
        reviewId: string,
        body: ReportReviewBody,
    ) {
        const { description } = body;
        const createdReport = await this.reportService.create({
            description,
            reporterId,
            targetId: reviewId,
            type: ReportType.REVIEW,
        });
        return createdReport;
    }
}
