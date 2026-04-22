import type { Request, Response } from 'express';
import Author from '../models/Author.js';

export const createAuthor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, bio, birthDate, nationality } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Author name is required' });
      return;
    }

    const authorData: any = { name, bio, nationality };
    if (birthDate) {
      authorData.birthDate = new Date(birthDate);
    }

    const author = await Author.create(authorData);

    res.status(201).json({
      message: 'Author created successfully',
      data: author,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create author',
      message: error.message,
    });
  }
};
