import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
export async function register(req, res, next) { try { const { name, email, password } = req.body; if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, campus email, and an 8-character password are required' }); if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' }); const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) }); res.status(201).json({ token: jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' }), user: { id: user.id, name: user.name, email: user.email } }); } catch (error) { next(error); } }
export async function login(req, res, next) { try { const user = await User.findOne({ email: req.body.email?.toLowerCase() }); if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' }); res.json({ token: jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' }), user: { id: user.id, name: user.name, email: user.email } }); } catch (error) { next(error); } }

