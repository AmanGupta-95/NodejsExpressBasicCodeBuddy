import type { Request, Response } from 'express';
import Book from '../models/Book.js';
import mongoose from 'mongoose';
import {
  getBooksByAuthorPipeline,
  getBooksByGenrePipeline,
} from '../aggregations/bookAggregations.js';

export const createBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      title,
      isbn,
      author,
      genres,
      publishedDate,
      pages,
      description,
      language,
    } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Book title is required' });
      return;
    }

    if (!author) {
      res.status(400).json({ error: 'Author is required' });
      return;
    }

    const bookData: any = {
      title,
      isbn,
      author,
      genres,
      pages,
      description,
      language,
    };
    if (publishedDate) {
      bookData.publishedDate = new Date(publishedDate);
    }

    const book = await Book.create(bookData);

    res.status(201).json({
      message: 'Book created successfully',
      data: book,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        error: 'Book with this ISBN already exists',
      });
      return;
    }
    res.status(500).json({
      error: 'Failed to create book',
      message: error.message,
    });
  }
};

export const getBooksByAuthor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { authorId } = req.params;

    if (!authorId || typeof authorId !== 'string') {
      res.status(400).json({ error: 'Author ID is required' });
      return;
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      res.status(400).json({ error: 'Invalid author ID' });
      return;
    }

    const books = await Book.aggregate(getBooksByAuthorPipeline(authorId));

    res.status(200).json({
      message: 'Books by author retrieved successfully',
      count: books.length,
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to retrieve books by author',
      message: error.message,
    });
  }
};

export const getBooksByGenre = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { genreId } = req.params;

    if (!genreId || typeof genreId !== 'string') {
      res.status(400).json({ error: 'Genre ID is required' });
      return;
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(genreId)) {
      res.status(400).json({ error: 'Invalid genre ID' });
      return;
    }

    const books = await Book.aggregate(getBooksByGenrePipeline(genreId));

    res.status(200).json({
      message: 'Books by genre retrieved successfully',
      count: books.length,
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to retrieve books by genre',
      message: error.message,
    });
  }
};
