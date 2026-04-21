import express from 'express';
import config from './config/config.js';

const app = express();

app.use(express.json());

app.get('/hello', (_, res) => {
  res.send('Hello, World!');
});

app.get('/hello/:username', (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).send('Username is required');
  }
  res.send(`Hello, ${username}!`);
});

app.post('/hello', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }
  res.send(`Hello, ${username}!`);
});

app.listen(config.port, () => {
  console.log(
    `Server is running on port ${config.port} in ${config.nodeEnv} mode.`,
  );
});
