import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import contactRoutes from './routes/contactRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();
connectDB();

const express = require("express");
const path = require("path");



const app = express();

/* ---------- Core middleware ---------- */
app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, cb) {
      // allow REST tools / same-origin requests with no origin
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

/* ---------- Rate limiting ---------- */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// Stricter limit for the public contact endpoint to deter spam.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many submissions. Please try again in an hour.' },
});

/* ---------- Routes ---------- */
app.get('/api/health', (req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime(), ts: Date.now() })
);

app.use('/api/contacts', contactLimiter, contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* ---------- Errors ---------- */
app.use(notFound);
app.use(errorHandler);

/* ---------- Boot ---------- */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`✓ API running in ${process.env.NODE_ENV || 'development'} on http://localhost:${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.error(`✗ Unhandled rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
