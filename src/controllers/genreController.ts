import type { Request, Response } from 'express';
import Genre from '../models/Genre.js';

export const createGenre = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Genre name is required' });
      return;
    }

    const genre = await Genre.create({
      name,
      description,
    });

    res.status(201).json({
      message: 'Genre created successfully',
      data: genre,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        error: 'Genre with this name already exists',
      });
      return;
    }
    res.status(500).json({
      error: 'Failed to create genre',
      message: error.message,
    });
  }
};
