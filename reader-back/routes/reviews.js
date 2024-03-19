const express = require('express');
const db = require('../server');
const router = express.Router();

router.post('/add', async (req, res) => {
    let { rev } = req;
    var query = "insert into reviews (bookId, rating, title, text) values (?,?,?,?)";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [rev.bookId, rev.rating, rev.title, rev.text], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        return res.status(200).json({ success: true, message: "Review Added Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured when adding review. Please try again later.' });
    }
});

router.delete('/remove', async (req, res) => {
    const revId = req;
    var query = "delete from reviews where id = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [revId], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        if (results.affectedRows == 0) {
            return res.status(404).json({ success: false, message: 'User Id does not exist.' });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch {
        return res.status(500).json({ success: false, message: 'An error occured while deleting your profile.' });
    }
});

router.get('/getByBook', async (req, res) => {
    const { book } = req;
    var query = "select rating, title, text from reviews where bookId = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [book.id], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        return res.status(200).json({ success: true, revs: results });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured while retrieving reviews. Please try again later.' });
    }
});

module.exports = router;