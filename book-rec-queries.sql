/*
All scripts used in the recommendation route
*/
-- Fav Author
SELECT books.author, count(*) as count
        FROM wereader.favbooks
        INNER JOIN wereader.books on favbooks.bookId = books.id
        WHERE userId = 1 AND bookRank < 11
        GROUP BY books.author
        ORDER BY count DESC;

SELECT *
        FROM wereader.books
        WHERE author = 'Blake Crouch'
        ORDER BY CASE WHEN genre = 'Fiction' THEN 0 ELSE 1 END, avgRating DESC, rateCount DESC
;

-- Fav Genre
SELECT *
FROM wereader.books
WHERE books.genre = 'Fiction' AND books.avgRating >= 3
ORDER BY books.avgRating DESC
LIMIT 20;

-- popular
SELECT * 
FROM wereader.books
WHERE books.avgRating > 3
ORDER BY avgRating DESC, rateCount DESC
LIMIT 20;

-- recently published
SELECT *
FROM wereader.books
ORDER BY pubDate DESC, avgRating DESC
LIMIT 20;