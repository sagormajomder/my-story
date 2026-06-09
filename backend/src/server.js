import app from './app.js';
import { connectDB } from './config/db.js';
import env from './config/env.js';

const port = env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(port, async () => {
    console.log(`server is running at http://localhost:${port}`);
  });

  process.on('unhandledRejection', reason => {
    console.error('❌ Unhandled Rejection:', reason);
    process.exit(1);
  });

  process.on('uncaughtException', err => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

