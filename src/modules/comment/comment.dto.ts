export class CreateCommentBody {
    content: string;
    reviewId: string;
    parentId?: string;
}

export class UpdateCommentBody {
    content: string;
}

export class ReportCommentBody {
    description?: string;
}
