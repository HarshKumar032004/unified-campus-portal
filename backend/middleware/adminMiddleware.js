
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access Denied. Only admins can perform this action.',
    });
  }
};

export default isAdmin;
