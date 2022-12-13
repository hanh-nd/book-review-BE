import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Query,
} from '@nestjs/common';
import { SuccessResponse } from 'src/common/helper/response';
import {
    JoiValidationPipe,
    RemoveEmptyQueryPipe,
    TrimBodyPipe,
} from 'src/common/pipes';
import { CreateBookBody } from './book.dto';
import { IBookGetListQuery } from './book.interface';
import { bookGetListSchema, createBookSchema } from './book.validator';
import { BookService } from './services/book.service';

@Controller('/books')
export class BookController {
    constructor(private bookService: BookService) {}

    @Get('/')
    async getBookList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(bookGetListSchema),
        )
        query: IBookGetListQuery,
    ) {
        try {
            const result = await this.bookService.getList(query);
            return new SuccessResponse(result);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('/')
    async createBookSchema(
        @Body(new TrimBodyPipe(), new JoiValidationPipe(createBookSchema))
        body: CreateBookBody,
    ) {
        try {
            const book = await this.bookService.create(body);
            return new SuccessResponse(book);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
