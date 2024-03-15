const express = require('express');
const db = require('../server');
const router = express.Router();

// Verify the JWT token
router.use((req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
    }
});

router.post('/add', (req, res) => {
    let { rev } = req;
    var query = "insert into reviews (bookId, rating, title, text) values (?,?,?,?)";
    try {
        const results = db.query(query, [rev.bookId, rev.rating, rev.title, rev.text]);
        return res.status(200).json({ success: true, message: "Review Added Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured when adding review. Please try again later.' });
    }
});

router.get('/getByBook', (req, res) => {
    const { book } = req;
    var query = "select rating, title, text from reviews where bookId = ?";
    try {
        const results = db.query(query, [book.id]);
        return res.status(200).json({ success: true, revs: results });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured while retrieving reviews. Please try again later.' });
    }
});

module.exports = router;