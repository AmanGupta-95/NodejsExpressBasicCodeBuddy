import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuthor extends Document {
  _id: Types.ObjectId;
  name: string;
  bio?: string;
  birthDate?: Date;
  nationality?: string;
  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    birthDate: {
      type: Date,
    },
    nationality: {
      type: String,
      trim: true,
      maxlength: [50, 'Nationality cannot exceed 50 characters'],
    },
  },
  {
    timestamps: true,
  },
);

// Virtual property to get all books by this author
authorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author',
});

// Ensure virtual fields are serialized
authorSchema.set('toJSON', { virtuals: true });
authorSchema.set('toObject', { virtuals: true });

const Author = mongoose.model<IAuthor>('Author', authorSchema);

export default Author;
