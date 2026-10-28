import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusbid',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
