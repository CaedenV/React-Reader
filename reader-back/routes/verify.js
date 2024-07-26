const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: 'Missing authorization header.',
      message: 'Please provide a valid authorization header.'
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded.id;

    next();
  } catch (err) {
    return res.status(403).json({
      error: err.message,
      message: 'Forbidden. Invalid token.'
    });
  }
};

module.exports = verifyJWT;