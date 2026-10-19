import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware (skeleton).
 *
 * Expects the token in the `Authorization` header as:
 *   Authorization: Bearer <token>
 *
 * On success, attaches the decoded payload to `req.user` and calls next().
 * Extend the payload verification (e.g., check user exists in DB) as needed.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Not authorized — no token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request for downstream handlers
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401);
    next(new Error('Not authorized — token invalid or expired'));
  }
};

/**
 * Helper: generate a signed JWT for a given payload.
 *
 * @param {Object} payload - Data to embed in the token (e.g., { id, email, role })
 * @returns {string} Signed JWT string
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export { protect, generateToken };
