import { Document } from 'mongoose';
import { ICommonGetListQuery } from 'src/common/interfaces';
import { Report } from 'src/mongo-schemas/report.schema';

export type ReportDocument = Document<Report>;

export type IReportGetListQuery = ICommonGetListQuery;
