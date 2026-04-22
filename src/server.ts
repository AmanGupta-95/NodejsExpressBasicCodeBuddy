import express from 'express';
import config from './config/config.js';
import { connectDatabase } from './config/database.js';
import routes from './routes/routes.js';

const app = express();

app.use(express.json());

// Basic Nodejs and Express server with TypeScript Task
app.get('/hello', (_, res) => {
  res.send('Hello, World!');
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

// Connect to database and start server
const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(
      `Server is running on port ${config.port} in ${config.nodeEnv} mode.`,
    );
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
