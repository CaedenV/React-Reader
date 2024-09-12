import './userDash.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { recBack, userBack } from '../../backendRoutes';
import BookNoDesc from '../../components/BookDisplay/NoDesc/BookNoDesc';

const UserDash = ({ userId }) => {
  const [user, setUser] = useState({});
  const [recs, setRecs] = useState({});
  const [userLib, setUserLib] = useState({});

  const token = localStorage.getItem('token'); 

  useEffect(() => {
    async function FetchData() {
      await axios.get(`${userBack}/getRecInfo`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => { setUser(response.data.user); });
      await axios.get(`${userBack}/libraries`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => { setUserLib(response.data.library); })
    }

    async function FetchRecs() {
      if (user.favGenre) {
        await axios.get(`${recBack}/getRecs`, {
          params: {
            genre: user.favGenre,
            current: user.nowRead,
          },
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((response) => { setRecs(response.data.recs); });
      }
    }

    FetchData().then(() => {
      FetchRecs();
    });
  }, [userId]);

  return (
    <div className="dashboard">
      <h1 className='dashTitle'>Dashboard</h1>

      {user.favGenre && 
        <div className="genre group">
          <h2>{user.favGenre} books you may enjoy:</h2>
          <div className="books">
            {recs.genreBased && recs.genreBased.length > 0 &&
              recs.genreBased.map((book, i) => (
                <BookNoDesc
                  key={i}
                  cover={book.cover}
                  title={book.title}
                  pubDate={book.pubDate}
                  auth={book.author}
                  avgRate={book.avgRating}
                  genres={book.genre}
                  id={book.id}
                  rateCount={book.rateCount}
                  user={userId}
                  lib={userLib}
                />
              ))}
          </div>
        </div>
      }

      {userLib && userLib.faved &&
        <div className="author group">
          <h2>Based on some of your favorite authors:</h2>
          <div className="books">
            {recs.authorBased && recs.authorBased.length > 0 &&
              recs.authorBased.map((book, i) => (
                <BookNoDesc
                  key={i}
                  cover={book.cover}
                  title={book.title}
                  pubDate={book.pubDate}
                  auth={book.author}
                  avgRate={book.avgRating}
                  genres={book.genre}
                  id={book.id}
                  rateCount={book.rateCount}
                  user={userId}
                  lib={userLib}
                />
              ))}
          </div>
        </div>
      }

      {recs.popular &&
        <div className="popular group">
          <h2>Popular Books:</h2>
          <div className="books">
            {recs.popular && recs.popular.length > 0 &&
              recs.popular.map((book, i) => (
                <BookNoDesc
                  key={i}
                  cover={book.cover}
                  title={book.title}
                  pubDate={book.pubDate}
                  auth={book.author}
                  avgRate={book.avgRating}
                  genres={book.genre}
                  id={book.id}
                  rateCount={book.rateCount}
                  user={userId}
                  lib={userLib}
                />
              ))}
          </div>
        </div>
      }

      {recs.recents &&
        <div className="recent group">
          <h2>Some new releases:</h2>
          <div className="books">
            {recs.recents && recs.recents.length > 0 &&
              recs.recents.map((book, i) => (
                <BookNoDesc
                  key={i}
                  cover={book.cover}
                  title={book.title}
                  pubDate={book.pubDate}
                  auth={book.author}
                  avgRate={book.avgRating}
                  genres={book.genre}
                  id={book.id}
                  rateCount={book.rateCount}
                  user={userId}
                  lib={userLib}
                />
              ))}
          </div>
        </div>
      }

      {/*
      {recs.fav &&
        <div className="favs group">
          <h2>Based on your favorites:</h2>
          <div className="books">
            {recs.genre.map((book, i) => (
              <BookNoDesc
                  key={i}
                  cover={book.cover}
                  title={book.title}
                  pubDate={book.pubDate}
                  auth={book.author}
                  avgRate={book.avgRating}
                  genres={book.genre}
                  id={book.id}
                  rateCount={book.rateCount}
                  user={userId}
                  lib={userLib}
                />
              ))}
          </div>
        </div>
      }

      {recs.wish &&
        <div className="wishlist group">
          <h2>Based on your Wishlist:</h2>
          <div className="books">
            {recs.wish.map((book, i) => (
              <BookNoDesc
                  key={i}
                  cover={book.cover}
                  title={book.title}
                  pubDate={book.pubDate}
                  auth={book.author}
                  avgRate={book.avgRating}
                  genres={book.genre}
                  id={book.id}
                  rateCount={book.rateCount}
                  user={userId}
                  lib={userLib}
                />))}
          </div>
        </div>
      }

      {recs.notifs &&
        <div className="notifs group">
          <h2>Based on what your friends recommended:</h2>
          <div className="books">
            {recs.friends.map((book, i) => (
              <BookNoDesc
                  key={i}
                  cover={book.cover}
                  title={book.title}
                  pubDate={book.pubDate}
                  auth={book.author}
                  avgRate={book.avgRating}
                  genres={book.genre}
                  id={book.id}
                  rateCount={book.rateCount}
                  user={userId}
                  lib={userLib}
                />))}
          </div>
        </div>
      } */}
    </div>
  )
}

export default UserDash