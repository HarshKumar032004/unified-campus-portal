import rateLimit from 'express-rate-limit';

// Global Rate Limiting: Max 100 requests per 15 mins per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again in 15 minutes.',
});

// Strict Rate Limiting: Max 5 requests per minute for sensitive POST routes
export const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many requests from this IP, please try again in 1 minute.',
});
