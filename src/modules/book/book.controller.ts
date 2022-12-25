import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { SuccessResponse } from 'src/common/helper/response';
import {
    JoiValidationPipe,
    RemoveEmptyQueryPipe,
    TrimBodyPipe,
} from 'src/common/pipes';
import { CreateBookBody, UpdateBookBody } from './book.dto';
import { IBookGetListQuery } from './book.interface';
import {
    bookGetListSchema,
    createBookSchema,
    updateBookSchema,
} from './book.validator';
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
            throw error;
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
            throw error;
        }
    }

    @Get('/:id')
    async getBookDetail(@Param('id') id: string) {
        try {
            const book = await this.bookService.findById(id);
            return new SuccessResponse(book);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/:id')
    async updateBook(
        @Param('id') id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(updateBookSchema))
        body: UpdateBookBody,
    ) {
        try {
            const book = await this.bookService.update(id, body);
            return new SuccessResponse(book);
        } catch (error) {
            throw error;
        }
    }

    @Delete('/:id')
    async deleteBook(@Param('id') id: string) {
        try {
            const result = await this.bookService.delete(id);
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }
}
