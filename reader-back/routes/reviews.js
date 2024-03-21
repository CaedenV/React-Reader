const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');

router.post('/add', verifyJWT, async (req, res) => {
    const { book, rating, title, text } = req.body;
    const user = req.user;
    try {
        let query = "insert into reviews (bookId, rating, title, text, user) values (?,?,?,?,?)";
        await db.queryDatabase(query, [book, rating, title, text, user]);
        return res.status(200).json({ success: true, message: "Review Added Successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occured when adding review. Please try again later.' + error });
    }
});

router.get('/userWrote', verifyJWT, async (req, res) => {
    const userId = req.user;
    const { revId } = req.body;
    try {
        let query = "select user from reviews where id = ?";
        const results = await db.queryDatabase(query, [revId]);
        if (results[0].user === userId) {
            return res.status(200).json({ success: true, userWrote: true });
        }
        return res.status(200).json({ success: true, userWrote: false });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
})

router.delete('/remove', async (req, res) => {
    const { revId } = req.body;
    try {
        let query = "delete from reviews where id = ?";
        const results = await db.queryDatabase(query, [revId]);
        if (results.affectedRows == 0) {
            return res.status(404).json({ success: false, message: 'User Id does not exist.' });
        }
        return res.status(200).json({ success: true, message: 'review deleted successfully' });
    } catch {
        return res.status(500).json({ success: false, message: 'An error occured while deleting your review.' });
    }
});

router.get('/getByBook', async (req, res) => {
    const { bookId } = req.body;
    let query = "select id, rating, title, text, user from reviews where bookId = ?";
    try {
        const results = await db.queryDatabase(query, [bookId]);
        return res.status(200).json({ success: true, revs: results });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured while retrieving reviews. Please try again later.' });
    }
});

module.exports = router;