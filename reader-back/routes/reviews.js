const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');


async function updateBook(rateCount, avgRate, bookId) {
    try {
        let updateBookQuery = "UPDATE books SET rateCount = ?, avgRating = ? WHERE id = ?";
        await db.queryDatabase(updateBookQuery, [rateCount, avgRate, bookId]);
    }
    catch (err) {
        return err.message;
    }
}
async function getUserName(userId) {
    try {
        let nameQuery = "SELECT userName FROM users WHERE id = ?";
        const nameData = await db.queryDatabase(nameQuery, [userId]);
        return (nameData[0].userName);
    } catch (error) {
        return error.message;
    }
}


router.post('/add', verifyJWT, async (req, res) => {
    const { book, rating, title, text } = req.body.review;

    if (!book || !rating || !title || !text) {
        return res.status(400).json({ success: false, message: 'Missing required fields: book, rating, title, or text.' });
    }
    try {
        const userName = await getUserName(req.user);

        // Check if the user has already submitted a review for this book
        let existingReviewQuery = "select id from reviews where bookId = ? AND userName = ?";
        const existingReview = await db.queryDatabase(existingReviewQuery, [book, userName]);

        if (existingReview.length > 0) {
            // If the user has already submitted a review, update the existing one
            let updateReviewQuery = "UPDATE reviews SET rating = ?, title = ?, text = ?, postedAt = ? WHERE id = ?";
            await db.queryDatabase(updateReviewQuery, [rating, title, text, new Date(), existingReview[0].id]);
        } else {
            // If the user hasn't submitted a review yet, insert a new one
            let insertReviewQuery = "INSERT INTO reviews (bookId, rating, title, text, userName, postedAt) VALUES (?, ?, ?, ?, ?, ?)";
            await db.queryDatabase(insertReviewQuery, [book, rating, title, text, userName, new Date()]);
        }

        // Update book statistics
        let numQuery = "SELECT rateCount, avgRating, prevRate FROM books WHERE id = ?";
        const ratesRow = await db.queryDatabase(numQuery, [book]);
        let rates = ratesRow[0];

        if (existingReview.length === 0) {
            rates.avgRating = (rates.avgRating * rates.rateCount + rating) / (rates.rateCount + 1);
            rates.rateCount += 1;
        }
        else {
            rates.avgRating = ((rates.prevRate * (rates.rateCount - 1) + existingReview.rating) - existingReview.rating + rating) / rates.rateCount;
        }

        await updateBook(rates.rateCount, rates.avgRating, book);
        return res.status(200).json({ success: true, message: "Review Added Successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occurred when adding or updating review. Please try again later.', error: error.message });
    }
});

router.get('/userWrote/:revId', verifyJWT, async (req, res) => {
    const userId = req.user;
    const { revId } = req.params;
    try {
        let query = "select userName from reviews where id = ?";
        const results = await db.queryDatabase(query, [revId]);
        const revUser = results[0].userName;

        try {
            const userName = await getUserName(userId);

            if (userName === revUser) {
                return res.status(200).json({ success: true, userWrote: true });
            }
            return res.status(200).json({ success: true, userWrote: false });

        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/user/:userName', verifyJWT, async (req, res) => {
    const { userName } = req.params;
    //console.log(req.params);
    try {
        //console.log(req.user, userName);
        try {
            let query = `
                SELECT (books.id) AS bookId, (books.title) AS bookTitle, books.author, reviews.rating, (reviews.title) AS revTitle, reviews.postedAt
                FROM reviews
                INNER JOIN books on reviews.bookId = books.id
                WHERE userName = ?
                ORDER BY reviews.postedAt DESC
            `;
            const results = await db.queryDatabase(query, [userName]);
            return res.status(200).json({ success: true, userRevs: results });
        } catch (revsErr) {
            return res.status(500).json({ success: false, message: 'An error ocurred retrieving your reviews.', error: revsErr.message });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'An error ocurred.', error: error.message });
    }
});

router.get('/getByBook/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const { userId } = req.query;
    let userName = "";
    if (userId) {
        userName = await getUserName(userId);
    }
    //console.log(userName);

    let query = `
        select id, rating, title, text, userName 
        from reviews 
        where bookId = ? 
        order by CASE WHEN userName = ? THEN 0 ELSE 1 END`;
    try {
        const results = await db.queryDatabase(query, [bookId, userName]);
        return res.status(200).json({ success: true, revs: results });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured while retrieving reviews. Please try again later.', error: err.message });
    }
});

router.delete('/delete', verifyJWT, async (req, res) => {
    const { bookId, id } = req.body;
    try {
        let query = "delete from reviews where id = ?";
        const results = await db.queryDatabase(query, [id]);
        if (results.affectedRows == 0) {
            return res.json({ success: false, message: "Review not found." });
        }
        else {
            // Update book statistics
            let numQuery = "SELECT rateCount, avgRating, prevRate FROM books WHERE id = ?";
            const ratesRow = await db.queryDatabase(numQuery, [bookId]);
            let rate = ratesRow[0];
            rate.rateCount -= 1;
            rate.avgRating = rate.prevRate;

            await updateBook(rate.rateCount, rate.avgRating, bookId)
        }

        return res.status(200).json({ success: true, message: "Review Deleted Successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occured deleting the review. Please try again later.', error: error.message });
    }
});

module.exports = router;