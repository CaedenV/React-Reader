import './libraries.css';
import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import { userBack, bookBack } from '../../backendRoutes';
import BookNoDesc from '../../components/BookDisplay/BookNoDesc';
import BookWDesc from '../../components/BookDisplay/BookwDesc';

const Libraries = ({ userId }) => {
  const [userLib, setUserLib] = useState({});
  const [ownedBooks, setOwnedBooks] = useState([]);
  const [wishedBooks, setWishedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const token = localStorage.getItem('token');

  const getLib = async () => {
    const res = await axios.get(`${userBack}/libraries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUserLib(res.data.library);
    const ownIds = res.data.library.owned;
    const wishIds = res.data.library.wished;
    const favIds = res.data.library.faved;

    const ownData = await Promise.all(
      ownIds.map((obj) => fetchBookData(obj.bookId))
    );
    const wishData = await Promise.all(
      wishIds.map((obj) => fetchBookData(obj.bookId))
    );
    const favData = await Promise.all(
      favIds.map((obj) => fetchBookData(obj.bookId))
    );

    setOwnedBooks(ownData);
    setFavoriteBooks(favData);
    setWishedBooks(wishData);
  }

  const fetchBookData = async (bookId) => {
    const response = await axios.get(`${bookBack}/getById/${bookId}`);
    const bookData = await response.data.book;
    return bookData;
  };

  useEffect(() => {

    getLib();
  }, [userId]);

  return (
    <div className="library">
      <h1 className="libTitle">My Library</h1>
      <div className="ownWrapper">
        <h2>Owned Books</h2>
        <div className="ownList">
          {ownedBooks.length > 0 && wishedBooks.map((book, i) => (
            <BookNoDesc
              key={i}
              cover={book.cover}
              title={book.title}
              pubDate={book.pubDate}
              auth={book.author}
              avgRate={book.avgRating}
              genres={book.genre}
              id={book.id}
              user={userId}
              lib={userLib}
            />))}
          {ownedBooks.length === 0 && <p>No owned books found.</p>}
        </div>
      </div>
      <div className="libWrapper">
        <div className="listWrapper wishWrapper">
          <h2>Wishlist</h2>
          <div className="wishList">
            {wishedBooks.length > 0 && wishedBooks.map((book, i) => (
              <BookWDesc
                key={i}
                cover={book.cover}
                title={book.title}
                pubDate={book.pubDate}
                auth={book.author}
                avgRate={book.avgRating}
                genres={book.genre}
                desc={book.desc}
                id={book.id}
                user={userId}
                lib={userLib}
              />))}
            {wishedBooks.length === 0 && <p>No books in wishlist found.</p>}
          </div>
        </div>
        <div className="listWrapper favWrapper">
          <h2>Favorites</h2>
          <div className="favList">
            {favoriteBooks.length > 0 && favoriteBooks.map((book, i) => (
              <BookWDesc
                key={i}
                cover={book.cover}
                title={book.title}
                pubDate={book.pubDate}
                auth={book.author}
                avgRate={book.avgRating}
                genres={book.genre}
                desc={book.desc}
                id={book.id}
                user={userId}
                lib={userLib}
              />
            ))}
            {favoriteBooks.length === 0 && <p>No favorite books found.</p>}
          </div>
        </div>
      </div>
    </div >
  )
}

export default Libraries