const jwt = require('jsonwebtoken');

module.exports = function (req, res, proceed) {
  const token = req.cookies && req.cookies.jwt;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return proceed();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
