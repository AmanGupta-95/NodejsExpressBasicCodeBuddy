import type { Router as IRouter } from 'express';
import { Router } from 'express';
import { createAuthor } from '../controllers/authorController.js';
import {
  createBook,
  getBooksByAuthor,
  getBooksByGenre,
  getBookById,
  deleteBook,
} from '../controllers/bookController.js';
import { createGenre } from '../controllers/genreController.js';

const router: IRouter = Router();

// Author routes
router.post('/author', createAuthor);

// Book routes
router.post('/book', createBook);
router.get('/book/:bookId', getBookById);
router.get('/books/author/:authorId', getBooksByAuthor);
router.get('/books/genre/:genreId', getBooksByGenre);
router.delete('/books/:id', deleteBook);

// Genre routes
router.post('/genre', createGenre);

export default router;
