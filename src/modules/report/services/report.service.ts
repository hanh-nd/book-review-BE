import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
} from 'src/common/constants';
import { Report } from 'src/mongo-schemas/report.schema';
import { IReportGetListQuery } from '../report.interface';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

    generateMatchGetListQuery(query: IReportGetListQuery) {
        return {};
    }

    async getList(query: IReportGetListQuery) {
        try {
            const {
                page = DEFAULT_PAGE_VALUE,
                limit = DEFAULT_PAGE_LIMIT,
                orderBy = OrderBy.ID,
                orderDirection = OrderDirection.DESC,
            } = query;

            const offset = (+page - 1) * +limit;

            const [result] = await this.reportModel.aggregate([
                {
                    $match: this.generateMatchGetListQuery(query),
                },
                {
                    $skip: offset,
                },
                {
                    $limit: +limit,
                },
                {
                    $sort: {
                        [orderBy]:
                            orderDirection === OrderDirection.ASC ? 1 : -1,
                    },
                },
                {
                    $facet: {
                        items: [],
                        totalItems: [
                            {
                                $count: 'count',
                            },
                        ],
                    },
                },
            ]);
            result.totalItems = result.totalItems[0].count;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string) {
        const result = await this.reportModel.findByIdAndDelete(id);
        return result;
    }
}
