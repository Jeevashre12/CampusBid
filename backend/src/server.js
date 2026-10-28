import http from 'node:http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app.js';
import { env } from './config/env.js';
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.frontendUrl } });
io.on('connection', (socket) => socket.on('join-listing', (listingId) => socket.join(`listing:${listingId}`)));
mongoose.connect(env.mongoUri).then(() => server.listen(env.port, () => console.log(`CampusBid API listening on http://localhost:${env.port}`))).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exitCode = 1; });

