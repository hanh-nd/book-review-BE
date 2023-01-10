import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
    DEFAULT_PAGE_LIMIT,
    DEFAULT_PAGE_VALUE,
    OrderBy,
    OrderDirection,
} from 'src/common/constants';
import { Report } from 'src/mongo-schemas/report.schema';
import { CreateReportBody, UpdateReportBody } from '../report.dto';
import { IReportGetListQuery } from '../report.interface';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

    generateMatchGetListQuery(query: IReportGetListQuery) {
        const { resolved } = query;
        const matchQuery: any = {};
        if (resolved) {
            matchQuery.resolved = resolved;
        }

        return matchQuery;
    }

    async create(body: CreateReportBody) {
        const { reporterId, targetId } = body;
        const createdReport = await this.reportModel.create({
            ...body,
            reporterId: new ObjectId(reporterId),
            targetId: new ObjectId(targetId),
        });
        return createdReport;
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

    async update(id: string, body: UpdateReportBody) {
        const result = await this.reportModel.findByIdAndUpdate(id, body);
        return result;
    }
}
