import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing. Add your MongoDB Atlas connection string to backend/.env.');
  }

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10_000
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection failed.');
    console.error('Check MONGODB_URI, the Atlas database user, password encoding, and Network Access IP allowlist.');
    throw error;
  }
}
