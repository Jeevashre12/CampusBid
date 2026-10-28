import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function requireAuth(req, res, next) { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ message: 'Authentication required' }); try { req.user = jwt.verify(token, env.jwtSecret); next(); } catch { return res.status(401).json({ message: 'Invalid or expired token' }); } }

