const express = require('express');
const router = express.Router();
const db = require('../db');

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
function generateRecommendations(user, books, similarityMatrix) {
    const userProfile = user.likedBooks.map(bookId => ({ bookId, rating: books[bookId].rating }));
    const similarityScores = [];
    for (let i = 0; i < books.length; i++) {
        if (!userProfile.some(profile => profile.bookId === i)) {
            const similarityScore = userProfile.reduce((score, profile) => score + similarityMatrix[i][profile.bookId] * profile.rating, 0);
            similarityScores.push({ bookId: i, similarityScore });
        }
    }
    similarityScores.sort((a, b) => b.similarityScore - a.similarityScore);
    return similarityScores.map(score => score.bookId);
}

// Utility function to get user preferences
function getUserPreferences(userId) {
    const favoriteBookIdsQuery = 'SELECT bookId FROM favbooks WHERE userId = ?';
    const favoriteBookIds = db.queryDatabase(favoriteBookIdsQuery, [userId]);

    const ownedBookIdsQuery = 'SELECT bookId FROM ownedbooks WHERE userId = ?';
    const ownedBookIds = db.queryDatabase(ownedBookIdsQuery, [userId]);

    const wishedBookIdsQuery = 'SELECT bookId FROM wishedbooks WHERE userId = ?';
    const wishedBookIds = db.queryDatabase(wishedBookIdsQuery, [userId]);

    const userFavGenreQuery = 'SELECT favGenre FROM users WHERE id = ?';
    const userFavGenre = db.queryDatabase(userFavGenreQuery, [userId]);

    const friendRecQuery = "SELECT book FROM notifs WHERE notifType = 'book' AND receiverId = ?";
    const friendRecBooks = db.queryDatabase(friendRecQuery, [userId]);

    return Promise.all([favoriteBookIds, ownedBookIds, wishedBookIds, userFavGenre, friendRecBooks])
        .then(([favorites, owned, wished, user, friendSent]) => {
            return {
                favorites: favorites,
                owned: owned,
                wished: wished,
                favGenre: user[0].favGenre,
                friendSent: friendSent
            };
        });
}

// Utility function to generate recommendation lists
async function generateRecommendations(userId) {
    const results = getUserPreferences(userId);

    const favoriteGenreBooksQuery = `
            SELECT books.id, books.title, books.cover, books.desc, books.author, books.pubDate, books.genre, books.avgRating, books.rateCount
            FROM books
            WHERE books.genre = ? AND books.avgRating >= 3
            ORDER BY books.rateCount desc
            LIMIT 15;
        `;
    const favoriteGenreBooks = db.queryDatabase(favoriteGenreBooksQuery, [results.favGenre]);

    const favoriteAuthorBooksQuery = `
            SELECT books.id, books.title, books.cover, books.desc, books.author, books.pubDate, books.genre, books.avgRating, books.rateCount
            FROM books
            INNER JOIN (
            SELECT bookId, SUM(rank) as totalRank
            FROM favbooks
            WHERE userId = ?
            GROUP BY bookId
            ) as favoriteBookRanks ON books.id = favoriteBookRanks.bookId
            WHERE books.author IN (
            SELECT author
            FROM favbooks
            WHERE userId = ?
            GROUP BY author
            HAVING SUM(bookRank)  < 11
          )
        `;
    const favoriteAuthorBooks = db.queryDatabase(favoriteAuthorBooksQuery, [userId, userId]);

    const reviewedBooksQuery = `
            SELECT books.id, books.title, books.cover, books.desc, books.author, books.pubDate, books.genre, books.avgRating, books.rateCount
            FROM books
            INNER JOIN reviews ON books.id = reviews.bookId
            WHERE reviews.userId = ?
        `;
    const reviewedBooks = db.queryDatabase(reviewedBooksQuery, [userId]);

    return Promise.all([favoriteGenreBooks, favoriteAuthorBooks])
        .then(([genreBased, authorBased]) => {
            return {
                genreBased: genreBased,
                AuthorBased: authorBased,
            };
        });
}


router.get('/generateRecs', async (req, res) => {
    const recs = generateRecommendations(req.user);
    return res.status(200).json({ success: true, recs: recs });
});

module.exports = router;