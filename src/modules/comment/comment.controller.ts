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
import { CreateCommentBody, UpdateCommentBody } from './comment.dto';
import { ICommentGetListQuery } from './comment.interface';
import {
    commentGetListSchema,
    createCommentSchema,
    updateCommentSchema,
} from './comment.validator';
import { CommentService } from './services/comment.service';

@Controller('/comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Post('/')
    @UseGuards(AccessTokenGuard)
    async createComment(
        @Req() req: RequestWithUser,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(createCommentSchema))
        createCommentBody: CreateCommentBody,
    ) {
        try {
            const userId = req.user.sub;
            const review = await this.commentService.createComment(
                userId,
                createCommentBody,
            );
            return new SuccessResponse(review);
        } catch (error) {
            throw error;
        }
    }

    @Get('/')
    async getCommentList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(commentGetListSchema),
        )
        query: ICommentGetListQuery,
    ) {
        try {
            const commentList = await this.commentService.getCommentList(query);
            return new SuccessResponse(commentList);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/:id')
    @UseGuards(AccessTokenGuard)
    async updateComment(
        @Req() req: RequestWithUser,
        @Param('id') id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(updateCommentSchema))
        body: UpdateCommentBody,
    ) {
        try {
            const userId = req.user.sub;
            const comment = await this.commentService.updateComment(id, body);
            return new SuccessResponse(comment);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/:id/react')
    async reactToComment(
        @Req() req: RequestWithUser,
        @Param('id') commentId: string,
    ) {
        try {
            const userId = req.user.sub;
            const comment = await this.commentService.react(commentId, userId);
            return new SuccessResponse(comment);
        } catch (error) {
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    async deleteComment(@Req() req: RequestWithUser, @Param('id') id: string) {
        try {
            const userId = req.user.sub;
            const result = await this.commentService.deleteComment(id);
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }
}
