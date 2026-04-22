import mongoose from 'mongoose';
import type { PipelineStage } from 'mongoose';

/**
 * Base aggregation pipeline for fetching books with populated relationships
 * @param matchCriteria - The criteria to match books (e.g., { author: ObjectId } or { genres: ObjectId })
 */
const getBooksPipeline = (matchCriteria: Record<string, any>): PipelineStage[] => {
  return [
    { $match: matchCriteria },
    {
      $lookup: {
        from: 'authors',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    {
      $lookup: {
        from: 'genres',
        localField: 'genres',
        foreignField: '_id',
        as: 'genreDetails',
      },
    },
    {
      $unwind: {
        path: '$authorDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        isbn: 1,
        publishedDate: 1,
        pages: 1,
        description: 1,
        language: 1,
        author: {
          _id: '$authorDetails._id',
          name: '$authorDetails.name',
          nationality: '$authorDetails.nationality',
        },
        genres: '$genreDetails',
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ];
};

// Thin wrapper functions
export const getBooksByAuthorPipeline = (authorId: string): PipelineStage[] => {
  return getBooksPipeline({ author: new mongoose.Types.ObjectId(authorId) });
};

export const getBooksByGenrePipeline = (genreId: string): PipelineStage[] => {
  return getBooksPipeline({ genres: new mongoose.Types.ObjectId(genreId) });
};

/**
 * Get a single book by ID with author name, genres, and total books count for author and genres
 */
export const getBookByIdPipeline = (bookId: string): PipelineStage[] => {
  return [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(bookId),
      },
    },
    {
      $lookup: {
        from: 'authors',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    {
      $unwind: {
        path: '$authorDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'books',
        localField: 'author',
        foreignField: 'author',
        as: 'authorBooks',
      },
    },
    {
      $lookup: {
        from: 'genres',
        let: { genreIds: '$genres' },
        pipeline: [
          {
            $match: {
              $expr: { $in: ['$_id', '$$genreIds'] },
            },
          },
          {
            $lookup: {
              from: 'books',
              let: { genreId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ['$$genreId', '$genres'] },
                  },
                },
              ],
              as: 'booksInGenre',
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              totalBooks: { $size: '$booksInGenre' },
            },
          },
        ],
        as: 'genreDetails',
      },
    },
    {
      $project: {
        title: 1,
        isbn: 1,
        publishedDate: 1,
        pages: 1,
        description: 1,
        language: 1,
        author: {
          _id: '$authorDetails._id',
          name: '$authorDetails.name',
          bio: '$authorDetails.bio',
          nationality: '$authorDetails.nationality',
          totalBooks: { $size: '$authorBooks' },
        },
        genres: '$genreDetails',
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];
};
