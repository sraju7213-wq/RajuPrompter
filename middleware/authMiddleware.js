module.exports = function authMiddleware(req, res, next) {
  // Placeholder authentication middleware. In production, replace with JWT/session validation.
  if (!req.user) {
    req.user = { id: req.headers['x-user-id'] };
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  return next();
};
