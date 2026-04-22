import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBook extends Document {
  _id: Types.ObjectId;
  title: string;
  isbn?: string;
  author: Types.ObjectId;
  genres: Types.ObjectId[];
  publishedDate?: Date;
  pages?: number;
  description?: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    isbn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author is required'],
    },
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
    publishedDate: {
      type: Date,
    },
    pages: {
      type: Number,
      min: [1, 'Pages must be at least 1'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    language: {
      type: String,
      trim: true,
      default: 'English',
      maxlength: [50, 'Language cannot exceed 50 characters'],
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
bookSchema.index({ author: 1 });
bookSchema.index({ genres: 1 });
bookSchema.index({ title: 1 });

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
