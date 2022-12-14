import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/helper/response';
import { RequestWithUser } from 'src/common/interfaces';
import {
    JoiValidationPipe,
    RemoveEmptyQueryPipe,
    TrimBodyPipe,
} from 'src/common/pipes';
import {
    CreateReviewBody,
    ReportReviewBody,
    UpdateReviewBody,
} from './review.dto';
import { IReviewGetListQuery } from './review.interface';
import {
    createReviewBodySchema,
    reviewGetListSchema,
    updateReviewBodySchema,
} from './review.validator';
import { ReviewService } from './services/review.service';

@Controller('/reviews')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    @Post('/')
    @UseGuards(AccessTokenGuard)
    async createReview(
        @Req() req: RequestWithUser,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(createReviewBodySchema))
        createReviewBody: CreateReviewBody,
    ) {
        try {
            const userId = req.user.sub;
            const review = await this.reviewService.create(
                userId,
                createReviewBody,
            );
            return new SuccessResponse(review);
        } catch (error) {
            throw error;
        }
    }

    @Get('/')
    async getReviewList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(reviewGetListSchema),
        )
        query: IReviewGetListQuery,
    ) {
        try {
            const reviewList = await this.reviewService.getReviewList(query);
            return new SuccessResponse(reviewList);
        } catch (error) {
            throw error;
        }
    }

    @Get('/:reviewId')
    async getReviewDetail(@Param('reviewId') reviewId: string) {
        try {
            const review = await this.reviewService.getReviewDetail(reviewId);
            return new SuccessResponse(review);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/:reviewId')
    @UseGuards(AccessTokenGuard)
    async updateReview(
        @Req() req: RequestWithUser,
        @Param('reviewId') id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(updateReviewBodySchema))
        body: UpdateReviewBody,
    ) {
        try {
            const userId = req.user.sub;
            const review = await this.reviewService.update(id, body);
            return new SuccessResponse(review);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/:reviewId/react')
    @UseGuards(AccessTokenGuard)
    async reactToReview(
        @Req() req: RequestWithUser,
        @Param('reviewId') reviewId: string,
    ) {
        try {
            const userId = req.user.sub;
            const review = await this.reviewService.react(reviewId, userId);
            return new SuccessResponse(review);
        } catch (error) {
            throw error;
        }
    }

    @Delete('/:reviewId')
    @UseGuards(AccessTokenGuard)
    async deleteReview(
        @Req() req: RequestWithUser,
        @Param('reviewId') id: string,
    ) {
        try {
            const userId = req.user.sub;
            const result = await this.reviewService.delete(id);
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }

    @Post('/:reviewId/report')
    @UseGuards(AccessTokenGuard)
    async reportReview(
        @Req() req: RequestWithUser,
        @Param('reviewId') id: string,
        @Body(new TrimBodyPipe()) body: ReportReviewBody,
    ) {
        try {
            const userId = req.user.sub;
            const result = await this.reviewService.reportReview(
                userId,
                id,
                body,
            );
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }
}
