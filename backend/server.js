// server.js  –  Entry point for the Express app

// Import required packages
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import lostItemRoutes from './routes/lostItemRoutes.js';
import outpassRoutes from './routes/outpassRoutes.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { globalLimiter, strictLimiter } from './middleware/rateLimiters.js';

// Load environment variables from the .env file
// This must be called before using process.env anywhere
dotenv.config();

// Create the Express application instance
const app = express();

// Middleware

// Allow requests from the React frontend (running on port 5173 via Vite)
// Without this, the browser will block API calls due to CORS policy
app.use(cors({ origin: 'http://localhost:5173' }));

// Set Security HTTP Headers
app.use(helmet());

// Parse incoming JSON request bodies
// (needed so req.body works for POST / PUT requests)
app.use(express.json());

// Express 5 makes req.query a getter only. 
// express-mongo-sanitize tries to mutate it, which causes a crash.
// This middleware redefines req.query as a writable property.
app.use((req, res, next) => {
  const query = req.query;
  Object.defineProperty(req, 'query', {
    value: query,
    writable: true,
    enumerable: true,
    configurable: true
  });
  next();
});

// Data sanitization against NoSQL query injection
// MUST be placed after express.json() so req.body is parsed
app.use(mongoSanitize());

// Global Rate Limiting: Max 100 requests per 15 mins per IP
app.use('/api', globalLimiter);

// Mount Routes
// All auth routes will be prefixed with /api/auth
// e.g. POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', strictLimiter, authRoutes);

// All grievance routes are prefixed with /api/grievances
// e.g. POST /api/grievances, GET /api/grievances/me
app.use('/api/grievances', grievanceRoutes);

// Lost & Found routes
app.use('/api/lost-items', lostItemRoutes);

// Outpass routes
app.use('/api/outpasses', outpassRoutes);

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit the process if the DB connection fails
    process.exit(1);
  }
};

// Call the connection function
connectDB();

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Grievance Portal API is running 🚀' });
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
