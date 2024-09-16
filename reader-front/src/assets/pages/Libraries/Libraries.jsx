import './libraries.css';
import React from 'react';
import apiClient from '../../axiosTokenIntercept';
import { useState, useEffect } from "react";
import { userBack, bookBack } from '../../backendRoutes';
import BookNoDesc from '../../components/BookDisplay/NoDesc/BookNoDesc';
import BookWDesc from '../../components/BookDisplay/Desc/BookwDesc';

const Libraries = ({ userId }) => {
  const [userLib, setUserLib] = useState({});
  const [ownedBooks, setOwnedBooks] = useState([]);
  const [wishedBooks, setWishedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  const getLib = async () => {
    const res = await apiClient.get(`${userBack}/libraries`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
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
    const response = await apiClient.get(`${bookBack}/getById/${bookId}`);
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
          {ownedBooks.length > 0 && ownedBooks.map((book, i) => (
            <BookNoDesc
              key={i}
              cover={book.cover}
              title={book.title}
              pubDate={book.pubDate}
              auth={book.author}
              avgRate={book.avgRating}
              genres={book.genre}
              rateCount={book.rateCount}
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
                rateCount={book.rateCount}
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
                rateCount={book.rateCount}
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