import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { SuccessResponse } from 'src/common/helper/response';
import { JoiValidationPipe, TrimBodyPipe } from 'src/common/pipes';
import { RequestWithUser } from './../../../dist/common/interfaces.d';
import { CreateReviewBody } from './review.dto';
import { createReviewBodySchema } from './review.validator';
import { ReviewService } from './services/review.service';

@Controller('/reviews')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    @Post('/')
    async createReview(
        @Req() req: RequestWithUser,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(createReviewBodySchema))
        createReviewBody: CreateReviewBody,
    ) {
        try {
            const userId = req.user.sub;
            createReviewBody.authorId = userId;
            const review = await this.reviewService.create(createReviewBody);
            return new SuccessResponse(review);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/:reviewId')
    async getReviewDetail(@Param('reviewId') reviewId: string) {
        try {
            const review = await this.reviewService.getReviewDetail(reviewId);
            return new SuccessResponse(review);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Patch('/:reviewId/react')
    async reactToReview(
        @Req() req: RequestWithUser,
        @Param('reviewId') reviewId: string,
    ) {
        try {
            const userId = req.user.sub;
            const review = await this.reviewService.react(reviewId, userId);
            return new SuccessResponse(review);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
