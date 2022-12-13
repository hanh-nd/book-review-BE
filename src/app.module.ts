import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { MongoModule } from './common/services/mongo.service';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { CommentModule } from './modules/comment/comment.module';
import { ReviewModule } from './modules/review/review.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        MongoModule,
        AuthModule,
        BookModule,
        CommentModule,
        ReviewModule,
        UserModule,
        ,
    ],
    controllers: [AppController],
    exports: [],
})
export class AppModule implements NestModule {
    configure() {
        mongoose.set('debug', true);
    }
}
