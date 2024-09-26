import './single.css';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import MakeRev from '../../components/Reviews/MakeRev';
import ShowRevs from '../../components/Reviews/ShowRevs';
import Popup from 'reactjs-popup';
import { bookBack, friendBack, userBack, revBack } from '../../backendRoutes';
import LibWrap from '../../components/LibraryWrapper/LibWrap';
import axios from 'axios';
import apiClient from '../../axiosTokenIntercept';
import ShareFriend from '../../components/ShareBtn/ShareFriend';
import moment from 'moment';

const Single = ({ userId }) => {
  const { bookId } = useParams();
  const token = localStorage.getItem('accessToken');

  const [bookInfo, setBookInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [userLib, setLib] = useState({});
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    const params = userId ? { userId } : {};
    axios.get(`${revBack}/getByBook/${bookId}`, { params })
      .then((response) => {
        setReviews(response.data.revs);
      });
  }

  useEffect(() => {
    getReviews();
  }, [bookId]);

  useEffect(() => {
    async function FetchAllInfo() {
      axios.get(`${bookBack}/getById/${bookId}`)
        .then((response) => {
          setBookInfo(response.data.book);
        });
      if (userId) {
        apiClient.get(`${friendBack}/getUser`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((response) => {
            setFriends(response.data.friends);
          });
        apiClient.get(`${userBack}/libraries`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((response) => { setLib(response.data.library); });
      }
    }

    FetchAllInfo();
  }, [bookId, userId, reviews]);


  return (
    <div className="mainContents">
      <main className="bookInfoContainer">
        <div className="contentWrapper">
          <aside className="imgColumn">
            <img loading='lazy' src={bookInfo.cover} alt="Book Cover" className="singleBookCover" />
          </aside>
          <section className="detailsColumn">
            <div className="detailsWrapper">
              <header className="headerSection">
                <div className="headerContent">
                  <div className="headerLayout">
                    <div className="titleColumn">
                      <div className="titleWrapper">
                        <h2 className="genre">{bookInfo.genre}</h2>
                        <h1 className="bookTitle">{bookInfo.title}</h1>
                        <p className="authorInfo">
                          {bookInfo.author} |{" "}
                          <span className='pubDate' >{moment(bookInfo.pubDate).format('YYYY-MM-DD')}</span>
                        </p>
                        <p className="rateInfo">
                          {bookInfo.avgRating} / 5 <i className="reviewIcon fa-solid fa-star-half-stroke" /> {bookInfo.rateCount} review(s)    
                        </p>
                      </div>
                    </div>
                    <div className="actionColumn">
                      {userId && <LibWrap bookId={bookId} libraries={userLib} />}
                      {userId ?
                        <Popup trigger={<button className='share'><i className="fa-regular fa-paper-plane" /></button>} position='bottom center'>
                          <div className="list">
                            {friends.length > 0 ? friends.map((friend, i) => (
                              <ShareFriend friend={friend} book={bookInfo} key={i} />
                            )) : <label className='friend'>Add more friends to share books with!</label>}
                          </div>
                        </Popup>
                       : <></>}
                    </div>
                  </div>
                </div>
              </header>
              <article className="desc">
                {bookInfo.desc}
              </article>
            </div>
          </section>
        </div>
      </main>
      <div className="revSection">
        <div className="revHeader">
          <h1>
            Reviews
          </h1>
        </div>
        {userId && <MakeRev bookId={bookId} getReviews={getReviews} />}
        <ShowRevs bookId={bookId} reviews={reviews} getReviews={getReviews} />
      </div>
    </div>
  )
}

export default Single;