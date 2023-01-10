import { ReportType } from 'src/common/constants';

export class CreateReportBody {
    targetId: string;
    type: ReportType;
    reporterId: string;
    description?: string;
}

export class UpdateReportBody {
    resolved: boolean;
}
