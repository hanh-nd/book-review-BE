import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { SuccessResponse } from 'src/common/helper/response';
import {
    JoiValidationPipe,
    RemoveEmptyQueryPipe,
    TrimBodyPipe,
} from 'src/common/pipes';
import { UpdateReportBody } from './report.dto';
import { IReportGetListQuery } from './report.interface';
import { reportGetListSchema, updateReportSchema } from './report.validator';
import { ReportService } from './services/report.service';

@Controller('/reports')
export class ReportController {
    constructor(private reportService: ReportService) {}

    @Get('/')
    async getReportList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(reportGetListSchema),
        )
        query: IReportGetListQuery,
    ) {
        try {
            const result = await this.reportService.getList(query);
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/:id')
    async updateReport(
        @Param('id') id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe(updateReportSchema))
        body: UpdateReportBody,
    ) {
        try {
            const updatedReport = await this.reportService.update(id, body);
            return updatedReport;
        } catch (error) {
            throw error;
        }
    }
}
