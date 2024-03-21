const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token in Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No Token' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Problem Decoding' });
        }
        req.user = decoded.id; // Attach decoded user data to the request object
        next();
    });
};

module.exports = verifyJWT;