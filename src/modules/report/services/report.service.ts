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
import { MongoCollection } from 'src/mongo-schemas/constant';
import { Report } from 'src/mongo-schemas/report.schema';
import { CreateReportBody, UpdateReportBody } from '../report.dto';
import { IReportGetListQuery } from '../report.interface';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

    generateMatchGetListQuery(query: IReportGetListQuery) {
        const { resolved = null } = query;
        const matchQuery: any = {};
        if (resolved !== null) {
            matchQuery.resolved = `${resolved}` === 'true';
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
                    $lookup: {
                        from: MongoCollection.REVIEW,
                        localField: 'targetId',
                        foreignField: '_id',
                        as: 'temp_target_1',
                    },
                },
                {
                    $set: {
                        targetId2: '$targetId',
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.COMMENT,
                        localField: 'targetId2',
                        foreignField: '_id',
                        as: 'temp_target_2',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        targetId: 1,
                        type: 1,
                        reporterId: 1,
                        description: 1,
                        resolved: 1,
                        target: {
                            $concatArrays: ['$temp_target_1', '$temp_target_2'],
                        },
                    },
                },
                {
                    $lookup: {
                        from: MongoCollection.USER,
                        localField: 'reporterId',
                        foreignField: '_id',
                        as: 'reporter',
                    },
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
            result.totalItems = result.totalItems?.[0]?.count || 0;
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
