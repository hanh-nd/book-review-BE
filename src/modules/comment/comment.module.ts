import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/mongo-schemas/report.schema';
import { ReportModule } from '../report/report.module';
import { Comment, CommentSchema } from './../../mongo-schemas/comment.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './services/comment.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: Report.name, schema: ReportSchema },
        ]),
        ReportModule,
    ],
    controllers: [CommentController],
    providers: [JwtService, CommentService],
})
export class CommentModule {}
