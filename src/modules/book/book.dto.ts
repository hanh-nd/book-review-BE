import { PartialType } from '@nestjs/mapped-types';

export class CreateBookBody {
    name: string;
    imageUrl?: string;
    describe?: string;
    author?: string;
    publisher?: string;
    publicationYear?: string;
}

export class UpdateBookBody extends PartialType(CreateBookBody) {}
