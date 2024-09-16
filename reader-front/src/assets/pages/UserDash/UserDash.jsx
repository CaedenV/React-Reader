import './userDash.css';
import React, { useState, useEffect } from 'react';
import apiClient from '../../axiosTokenIntercept';
import { recBack, userBack } from '../../backendRoutes';
import BookNoDesc from '../../components/BookDisplay/NoDesc/BookNoDesc';

const UserDash = ({ userId }) => {
  const [user, setUser] = useState({});
  const [recs, setRecs] = useState({});
  const [userLib, setUserLib] = useState({});

  const token = localStorage.getItem('accessToken');
  

  useEffect(() => {
    async function FetchData() {
      try {
        const userResponse = await apiClient.get(`${userBack}/getRecInfo`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data.user);
        const libraryResponse = await apiClient.get(`${userBack}/libraries`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserLib(libraryResponse.data.library);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    FetchData();
  }, [userId]);

  useEffect(() => {
    async function FetchRecs() {
      if (user && user.favGenre) {
        try {
          const recsResponse = await apiClient.get(`${recBack}/getRecs`, {
            params: {
              genre: user.favGenre,
              current: user.nowRead,
            },
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecs(recsResponse.data.recs);
          //console.log("Fetched recommendations:", recsResponse.data.recs);
        } catch (error) {
          console.error('Error fetching recs: ', error);
        }
      }
    }
    if (user && user.favGenre) {
      FetchRecs();
    }
  }, [user])

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

      {userLib && userLib.faved && recs &&
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