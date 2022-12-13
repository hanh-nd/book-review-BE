import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { MongoCollection } from 'src/mongo-schemas/constant';
import { Review } from 'src/mongo-schemas/review.schema';
import { CreateReviewBody } from './../review.dto';
@Injectable()
export class ReviewService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

    async create(createReviewBody: CreateReviewBody) {
        const createdReview = await this.reviewModel.create(createReviewBody);
        return createdReview;
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
                          $eq: userId,
                      },
                  },
              }
            : {
                  $push: {
                      likeIds: userId,
                  },
              };

        await toUpdateReview.update(updateQuery);
        return toUpdateReview;
    }
}
