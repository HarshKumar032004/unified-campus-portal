
import jwt from 'jsonwebtoken';

// Middleware for secured routes
const protect = (req, res, next) => {
  // Read the Authorization header value
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to restrict admin-only routes
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

export { protect, isAdmin };
