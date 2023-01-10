import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/mongo-schemas/report.schema';
import { Review, ReviewSchema } from 'src/mongo-schemas/review.schema';
import { ReportModule } from './../report/report.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './services/review.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
            { name: Report.name, schema: ReportSchema },
        ]),
        ReportModule,
    ],
    controllers: [ReviewController],
    providers: [JwtService, ReviewService],
})
export class ReviewModule {}
