import './userDash.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { recBack, userBack } from '../../backendRoutes';

const UserDash = ({ userId }) => {
  const [user, setUser] = useState();
  const [userLib, setUserLib] = useState({});
  const [recs, setRecs] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function FetchData() {
      await axios.get(`${userBack}/getMe`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => { setUser(response.data.user); });

      await axios.get(`${userBack}/libraries`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => { setUserLib(response.data.library); });
    }

    FetchData();
  }, [userId]);

  // useEffect(() => {
  //   async function FetchRecs() {
  //     if (user.favGenre) {
  //       await axios.get(`${recBack}/getRecs`,
  //         {
  //           userLib: userLib,
  //           genre: user.favGenre
  //         }, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       })
  //         .then((response) => { setRecs(response.data.recs); })
  //     }
  //   }

  //   FetchRecs();
  // }, [userId]);

  return (
    <div className="recsOverall">
      <h1>Dashboard</h1>

      {/* {user.favGenre &&
        <div className="genre group">
          <h2>{user.FavGenre} books you may enjoy:</h2>
          <div className="books">
            {recs.genreBased.map((book, i) => (
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
          </div>
        </div>
      }

      {recs.authorBased &&
        <div className="author group">
          <h2>Based on some of your favorite authors:</h2>
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
                user={userId}
                lib={userLib}
              />))}
          </div>
        </div>
      }

      {recs.fav &&
        <div className="favs group">
          <h2>Based on your past favorites:</h2>
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
                user={userId}
                lib={userLib}
              />))}
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
                user={userId}
                lib={userLib}
              />))}
          </div>
        </div>
      }

      {recs.own &&
        <div className="owned group">
          <h2>Based on WeReader books you own:</h2>
          <div className="books">
            {recs.own.map((book, i) => (
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
          </div>
        </div>
      }

      {recs.friends &&
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
                user={userId}
                lib={userLib}
              />))}
          </div>
        </div>
      }

      {recs.popular &&
        <div className="popular group">
          <h2>Popular Books:</h2>
          <div className="books">
            {recs.popular.map((book, i) => (
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
          </div>
        </div>
      } */}
    </div>
  )
}

export default UserDash