import app from './app.js';
import config from './config/config.js';
import { connectDatabase } from './config/database.js';

// Connect to database and start server
const startServer = async () => {
  //commenting out for jest testing task
  // await connectDatabase();

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
