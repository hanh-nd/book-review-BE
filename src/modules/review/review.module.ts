import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/mongo-schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './services/review.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Review.name,
                schema: ReviewSchema,
            },
        ]),
    ],
    controllers: [ReviewController],
    providers: [JwtService, ReviewService],
})
export class ReviewModule {}
