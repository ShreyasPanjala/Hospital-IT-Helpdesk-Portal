const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Access denied. Please login.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'hospital_helpdesk_secret');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session.' });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Not allowed for this role.' });
    next();
  };
}

module.exports = { auth, allowRoles };
