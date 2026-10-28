import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import { errorHandler, notFound } from './middleware/error.js';
const app = express();
app.use(helmet()); app.use(cors({ origin: env.frontendUrl })); app.use(express.json({ limit: '1mb' })); app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'CampusBid API', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/auth', authRoutes); app.use('/api/listings', listingRoutes);
app.use(notFound); app.use(errorHandler);
export default app;

