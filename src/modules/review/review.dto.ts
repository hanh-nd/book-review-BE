export class CreateReviewBody {
    bookId: string;
    content: string;
}

export class UpdateReviewBody {
    content: string;
}

export class ReportReviewBody {
    description?: string;
}
