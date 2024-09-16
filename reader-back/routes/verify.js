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
    if(err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'TokenExpiredError',
        message: 'Access token expired. Please use the refresh token to get a new access token.'
      });
    } else  if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        error: 'JsonWebTokenError',
        message: 'Invalid token. Access is forbidden'
      });
    } else {
      return res.status(403).json({
        error: 'UnknownError',
        message: 'An error occurred. Access is forbidden.'
      });
    }
    
  }
};

module.exports = verifyJWT;