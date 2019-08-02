import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body['x-access-token'] || null;

  if (!token) {
    return res.status(401).json({
      error: 'Please, sign-in!',
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        error: 'Failed to authenticate token',
      });
    }
    req.userId = decoded.userId || null;
    req.adminId = decoded.adminId || null;
    next();
    return true;
  });
  return true;
};

export default verifyToken;
