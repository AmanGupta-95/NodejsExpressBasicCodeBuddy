import type { Router as IRouter } from 'express';
import { Router } from 'express';
import { createAuthor } from '../controllers/authorController.js';
import { createBook } from '../controllers/bookController.js';
import { createGenre } from '../controllers/genreController.js';

const router: IRouter = Router();

// Author routes
router.post('/author', createAuthor);

// Book routes
router.post('/book', createBook);

// Genre routes
router.post('/genre', createGenre);

export default router;
