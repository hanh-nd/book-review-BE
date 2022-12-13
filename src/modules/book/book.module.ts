import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from 'src/mongo-schemas/book.schema';
import { BookController } from './book.controller';
import { BookService } from './services/book.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Book.name,
                schema: BookSchema,
            },
        ]),
    ],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}
