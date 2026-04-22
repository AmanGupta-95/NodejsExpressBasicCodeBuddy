import type { Request, Response } from 'express';
import Book from '../models/Book.js';

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
