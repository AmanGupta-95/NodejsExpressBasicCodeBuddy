import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGenre extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const genreSchema = new Schema<IGenre>(
  {
    name: {
      type: String,
      required: [true, 'Genre name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Genre name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  },
);

// Virtual property to get all books in this genre
genreSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'genres',
});

// Ensure virtual fields are serialized
genreSchema.set('toJSON', { virtuals: true });
genreSchema.set('toObject', { virtuals: true });

const Genre = mongoose.model<IGenre>('Genre', genreSchema);

export default Genre;
