import { Document } from 'mongoose';
import { Review } from 'src/mongo-schemas/review.schema';

export type ReviewDocument = Document<Review>;
