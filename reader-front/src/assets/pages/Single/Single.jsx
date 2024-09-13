import './single.css';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import MakeRev from '../../components/Reviews/MakeRev';
import ShowRevs from '../../components/Reviews/ShowRevs';
import Popup from 'reactjs-popup';
import { bookBack, friendBack, userBack, revBack } from '../../backendRoutes';
import LibWrap from '../../components/LibraryWrapper/LibWrap';
import axios from 'axios';
import ShareFriend from '../../components/ShareBtn/ShareFriend';
import moment from 'moment';

const Single = ({ userId }) => {
  const { bookId } = useParams();
  const token = localStorage.getItem('token');

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
        axios.get(`${friendBack}/getUser`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((response) => {
            setFriends(response.data.friends);
          });
        axios.get(`${userBack}/libraries`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((response) => { setLib(response.data.library); });
      }
    }

    FetchAllInfo();
  }, [bookId, userId, reviews]);


  return (
    <div className="mainContents">
      <span className="bookCoverTitle">
        <img src={bookInfo.cover}
          alt="Book Cover"
          className="singleBookCover"
        />
        <div className="bookDetails">
          <h1 className="singleBookTitle"> {bookInfo.title}
            {userId ? <div className="singleBookOpt">
              <LibWrap bookId={bookId} libraries={userLib} />
              <Popup trigger={<button className='share'><i className="fa-regular fa-share-from-square" /></button>} position='bottom center'>
                <div className="list">
                  {friends.length > 0 ? friends.map((friend, i) => (
                    <ShareFriend friend={friend} book={bookInfo} key={i} />
                  )) : <label className='friend'>Add more friends to share books with!</label>}
                </div>
              </Popup>
            </div> : <></>}
          </h1>
          <div className="singleBookInfo">
            <span className="singleAuthor">Author: <b>{bookInfo.author} </b></span>
            <span className="split">|</span>
            <span className="singlePub">{moment(bookInfo.pubDate).format('YYYY-MM-DD')}</span>
            <span className="split">|</span>
            <span className="singleGenre">{bookInfo.genre}</span>
            <span className="split">|</span>
            <span className="ratingNum">{bookInfo.avgRating}/5<i className="reviewIcon fa-solid fa-star-half-stroke" />: {bookInfo.rateCount} review(s)</span>

          </div>
          <p className="singleBookDesc">
            {bookInfo.desc}
          </p>
        </div>
      </span>
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