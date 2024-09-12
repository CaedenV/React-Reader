const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyJWT = require('./verify');

// Calculate Jaccard similarity between two book descriptions
function jaccardSimilarity(desc1, desc2) {
    const set1 = new Set(desc1.split(' '));
    const set2 = new Set(desc2.split(' '));
    const intersection = set1.size > set2.size ? set1.filter(value => set2.has(value)).size : set2.filter(value => set1.has(value)).size;
    const union = set1.size + set2.size - intersection;
    return intersection / union;
}

// Calculate Jaccard similarity matrix for all book descriptions
function calculateJaccardSimilarityMatrix(books) {
    const nBooks = books.length;
    const similarityMatrix = Array.from({ length: nBooks }, () => Array.from({ length: nBooks }, () => 0));
    for (let i = 0; i < nBooks; i++) {
        for (let j = i; j < nBooks; j++) {
            similarityMatrix[i][j] = jaccardSimilarity(books[i].description, books[j].description);
            similarityMatrix[j][i] = similarityMatrix[i][j];
        }
    }
    return similarityMatrix;
}

// Generate recommendations for a user based on their liked and ranked books
// function generateRecommendations(user, books, similarityMatrix) {
//     const userProfile = user.likedBooks.map(bookId => ({ bookId, rating: books[bookId].rating }));
//     const similarityScores = [];
//     for (let i = 0; i < books.length; i++) {
//         if (!userProfile.some(profile => profile.bookId === i)) {
//             const similarityScore = userProfile.reduce((score, profile) => score + similarityMatrix[i][profile.bookId] * profile.rating, 0);
//             similarityScores.push({ bookId: i, similarityScore });
//         }
//     }
//     similarityScores.sort((a, b) => b.similarityScore - a.similarityScore);
//     return similarityScores.map(score => score.bookId);
// }

async function generateFavAuthorBooks(userId, favGenre) {
    //1. Find the most common authors
    const commonAuthQ = `
        SELECT books.author, count(*) as count
        FROM favbooks
        INNER JOIN books on favbooks.bookId = books.id
        WHERE userId = ? AND favbooks.bookRank < 11
        GROUP BY books.author
        ORDER BY count DESC;
    `;
    const commonAuth = await db.queryDatabase(commonAuthQ, [userId]);
    const topAuthors = commonAuth.filter(author => author.count === commonAuth[0].count);
    const randomAuthor = topAuthors[Math.floor(Math.random() * topAuthors.length)];

    const topAuthBookQ = `
        SELECT *
        FROM books
        WHERE author = ?
        ORDER BY CASE WHEN genre = ? THEN 0 ELSE 1 END, avgRating DESC, rateCount DESC
        LIMIT 20;
    `;
    const topAuthBooks = await db.queryDatabase(topAuthBookQ, [randomAuthor.author, favGenre]);

    return topAuthBooks;
}

// Utility function to generate recommendation lists
async function generateRecommendations(userId, favGenre, current) {
    const favoriteGenreBooksQuery = `
        SELECT *
        FROM books
        WHERE books.genre = ? AND books.avgRating >= 3
        ORDER BY books.avgRating DESC
        LIMIT 20;
    `;

    const popularQuery = ` 
        SELECT * 
        FROM books
        WHERE books.avgRating > 3
        ORDER BY avgRating DESC, rateCount DESC
        LIMIT 20;
    `;

    const recentQuery = `
        SELECT *
        FROM books
        ORDER BY pubDate DESC, avgRating DESC
        LIMIT 20;
    `;
    // Recs based on notifs. Find similarites between books (genre, author, pubDate, etc) within notifs or librarie (owned, faved)

    const [favoriteGenreBooks, favoriteAuthorBooks, popularBooks, recentBooks] = await Promise.all([
        db.queryDatabase(favoriteGenreBooksQuery, [favGenre]),
        generateFavAuthorBooks(userId, favGenre),
        db.queryDatabase(popularQuery, []),
        db.queryDatabase(recentQuery, []),
    ]);

    const recs = {
        genreBased: favoriteGenreBooks,
        authorBased: favoriteAuthorBooks,
        popular: popularBooks,
        recents: recentBooks
    };

    return recs;
}


router.get('/getRecs', verifyJWT, async (req, res) => {
    const { genre, current } = req.query;

    const recs = await generateRecommendations(req.user, genre, current);
    return res.status(200).json({ success: true, recs: recs });
});

module.exports = router;