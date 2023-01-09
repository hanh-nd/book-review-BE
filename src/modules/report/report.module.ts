import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/mongo-schemas/report.schema';
import { ReportController } from './report.controller';
import { ReportService } from './services/report.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Report.name, schema: ReportSchema },
        ]),
    ],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportModule {}
