const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');

router.post('/add', verifyJWT, async (req, res) => {
    const { book, rating, title, text } = req.body.review;
    try {
        // Get the userName of the user leaving the review.
        let nameQuery = "SELECT userName FROM users WHERE id = ?";
        const nameData = await db.queryDatabase(nameQuery, [req.user]);
        const userName = nameData[0].userName;

        // Check if the user has already submitted a review for this book
        let existingReviewQuery = "select id from reviews where bookId = ? AND user = ?";
        const existingReview = await db.queryDatabase(existingReviewQuery, [book, userName]);
    
        if (existingReview.length > 0) {
            // If the user has already submitted a review, update the existing one
            let updateReviewQuery = "UPDATE reviews SET rating = ?, title = ?, text = ? WHERE id = ?";
            await db.queryDatabase(updateReviewQuery, [rating, title, text, existingReview[0].id]);
        } else {
            // If the user hasn't submitted a review yet, insert a new one
            let insertReviewQuery = "INSERT INTO reviews (bookId, rating, title, text, user) VALUES (?, ?, ?, ?, ?)";
            await db.queryDatabase(insertReviewQuery, [book, rating, title, text, userName]);
        }
    
        // Update book statistics
        let numQuery = "SELECT rateCount, avgRating FROM books WHERE id = ?";
        const ratesRow = await db.queryDatabase(numQuery, [book]);
        let rates = ratesRow[0];
        rates.rateCount += 1;
        rates.avgRating = ((rates.avgRating * (rates.rateCount - 1)) + rating) / rates.rateCount;
    
        let updateBookQuery = "UPDATE books SET rateCount = ?, avgRating = ? WHERE id = ?";
        await db.queryDatabase(updateBookQuery, [rates.rateCount, rates.avgRating, book]);
    
        return res.status(200).json({ success: true, message: "Review Added Successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occurred when adding or updating review. Please try again later.' + error.message });
    }
});

router.get('/userWrote/:revId', verifyJWT, async (req, res) => {
    const userId = req.user;
    const { revId } = req.params;
    try {
        let query = "select user from reviews where id = ?";
        const results = await db.queryDatabase(query, [revId]);
        const userName = results[0].user;

        try {
            let userQ = "select id from users where userName=?";
            const userRow = await db.queryDatabase(userQ, [userName]);

            if (userRow[0].id === userId) {
                return res.status(200).json({ success: true, userWrote: true });
            }
            return res.status(200).json({ success: true, userWrote: false });

        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

router.post('/overWrite', verifyJWT, async (req, res) => {
    const { book, rating, title, text } = req.body.review;
    try {
        let update = "update reviews set rating=?,title=?,text=? where bookId=? AND user=?";
        const results = await db.queryDatabase(update, [rating, title, text, book, req.user]);
        if (results.affectedRows === 0) {
            return res.status(500).json({success: false, message: "Review not found"});
        }
        return res.status(200).json({success: true, message: "review updated successfully!"});
    } catch (error) {
        return res.status(500).json({ success: false, message: 'An error occured while deleting your review.', error: error.message });
    }
});

router.get('/getByBook/:bookId', async (req, res) => {
    const { bookId } = req.params;
    let query = "select id, rating, title, text, user from reviews where bookId = ?";
    try {
        const results = await db.queryDatabase(query, [bookId]);
        return res.status(200).json({ success: true, revs: results });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured while retrieving reviews. Please try again later.', error: err });
    }
});

module.exports = router;