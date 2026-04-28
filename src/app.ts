import express, { type Application } from 'express';
import routes from './routes/routes.js';

const app: Application = express();

app.enable('strict routing');
app.use(express.json());

// Basic Nodejs and Express server with TypeScript Task
app.get('/hello', (_, res) => {
  res.send('Hello, World!');
});

app.get('/hello/', (_, res) => {
  return res.status(400).send('Username is required');
});

app.get('/hello/:username', (req, res) => {
  const { username } = req.params;
  res.send(`Hello, ${username}!`);
});

app.post('/hello', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }
  res.send(`Hello, ${username}!`);
});

// API Routes for Authors, Books, and Genres MongoDB Task
app.use('/api', routes);

export default app;
