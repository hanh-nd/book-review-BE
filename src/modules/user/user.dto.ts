export class CreateUserBody {
    username: string;
    password: string;
}

export class UpdateUserBody {
    password: string;
}

export class AddToBookShelfBody {
    bookId: string;
}
