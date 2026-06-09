import cors from 'cors';
import express from 'express';
import env from './config/env.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello Client',
  });
});

// Health route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date(),
  });
});

export default app;
