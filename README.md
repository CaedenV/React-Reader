# React-Reader
This project is the continuation/ remodel of my Senior Design Project that I've called WeReader. WeReader is a single-page web app that allows a user to search for books to read and share recommendations with their friends. Within my front end, I'm using the Google Books API to pull book data and insert properly filtered and formatted books into my own personal database using MySQL.

Main Functions:
I'm having the user login or create an account with minimal information, which will then allow them to add books, found from the search, to their own personal lists. The user is capable of adding a book to 3 different 'libraries' consisting of their owned books, their wish-listed books, and their ranked favorite books. Having so many user-generated preferences allows for ample data when creating recommendation algorithms. The user will also be able to view their profile, showing off the number of books in their libraries, the book they're currently reading, and the friends they've added on the website. They can also update aspects of their profile, such as their profile picture, username, and their favorite genre (increasing the recommendation data). 

Another key aspect of the website is the way for users to recommend books to other users! When the algorithms don't know as much as you would like, you're in-app friends can recommend books that they believe you would like. This is one of 3 different types of notifications a user may receive, along with friend requests and general 'system' notifications. I've decided on friend requests over simply adding based on usernames because of how impactful friends are on a user's notifications. I believe a user should have significant control over what can bother them.

Lastly, and most importantly, The user is able to read books they've purchased on the very website they obtained them. There is an active EPUB reader on the website that permits the user to make their reading experience more comfortable and engaging through different abilities like highlighting, leaving comments, saved book progression, and font-styling.


Tools:
WeReader was produced in ReactJS (Vite) with a MySQL database and Express connections in NodeJS. Code is written in JavaScript with components having a CSS for styling.

Front: npm run dev
Back: npm start
