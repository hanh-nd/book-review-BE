import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
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
import { UserService } from './services/user.service';
import { AddToBookShelfBody, UpdateUserBody } from './user.dto';
import { IUserGetListQuery } from './user.interface';
import {
    addToBookShelfSchema,
    updateUserProfileSchema,
    userGetListQuerySchema,
} from './user.validator';

@Controller('/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    async getUserList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(userGetListQuerySchema),
        )
        query: IUserGetListQuery,
    ) {
        try {
            const userList = await this.userService.getList(query);
            return new SuccessResponse(userList);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/:keyword')
    async getUserById(@Param('keyword') keyword: string) {
        try {
            const user = await this.userService.getUserDetail(keyword);
            return new SuccessResponse(user);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Patch('/update')
    @UseGuards(AccessTokenGuard)
    async updateProfile(
        @Req() req: RequestWithUser,
        @Body(
            new TrimBodyPipe(),
            new JoiValidationPipe(updateUserProfileSchema),
        )
        updateBody: UpdateUserBody,
    ) {
        try {
            const userId = req.user.sub;
            const user = await this.userService.updateProfile(
                userId,
                updateBody,
            );
            return new SuccessResponse(user);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Patch('/addToBookShelf')
    @UseGuards(AccessTokenGuard)
    async addToBookShelf(
        @Req() req: RequestWithUser,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(addToBookShelfSchema))
        addToBookShelfBody: AddToBookShelfBody,
    ) {
        try {
            const userId = req.user.sub;
            const user = await this.userService.addToBookShelf(
                userId,
                addToBookShelfBody.bookId,
            );
            return new SuccessResponse(user);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
}
