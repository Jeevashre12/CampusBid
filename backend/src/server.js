import http from 'node:http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app.js';
import { finalizeExpiredListings } from './controllers/listingController.js';
import { env } from './config/env.js';
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.frontendUrl } });
io.on('connection', (socket) => socket.on('join-listing', (listingId) => socket.join(`listing:${listingId}`)));
mongoose.connect(env.mongoUri).then(() => {
  const finalize = () => finalizeExpiredListings().catch((error) => console.error('Auction finalization failed:', error.message));
  finalize();
  const finalizationTimer = setInterval(finalize, 30_000);
  finalizationTimer.unref();
  server.listen(env.port, () => console.log(`CampusBid API listening on http://localhost:${env.port}`));
}).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exitCode = 1; });
