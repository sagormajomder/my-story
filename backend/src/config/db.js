import mongoose from 'mongoose';
import env from './env.js';

const db_uri = env.MONGODB_URI;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const dbCon = await mongoose.connect(db_uri);
    console.log(`DB is connected at ${dbCon.connection.host}`);
  } catch (error) {
    console.log('Database connection failed');
    console.log(error.message);
    process.exit(1);
  }
};
