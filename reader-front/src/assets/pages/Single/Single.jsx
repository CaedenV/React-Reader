import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import MakeRev from '../../components/Reviews/MakeRev';
import ShowRevs from '../../components/Reviews/ShowRevs';
import ShareBtn from '../../components/ShareBtn/ShareBtn';
import { bookBack, friendBack, userBack } from '../../backendRoutes';
import LibWrap from '../../components/LibraryWrapper/LibWrap';
import axios from 'axios';

const Single = ({ userId }) => {
  const { bookId } = useParams();
  const token = localStorage.getItem('token');

  const [bookInfo, setBookInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [userLib, setLib] = useState({});


  useEffect(() => {
    console.log(bookId);
    async function FetchAllInfo() {
      axios.get(`${bookBack}/getById/${bookId}`)
        .then((response) => {
          setBookInfo(response.data.book);
        });

      axios.get(`${friendBack}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setFriends(response.data.friends);
        });
      axios.get(`${userBack}/libraries`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => { setLib(response.data.library); console.log(response.data.library); });

    }
    FetchAllInfo();
  }, [bookId, userId]);

  return (
    <div className="mainContents">
      <span className="bookCoverTitle">
        <img src={bookInfo.cover}
          alt="Book Cover"
          className="singleBookCover"
        />
        <span className="bookDetails">
          <h1 className="singleBookTitle"> {bookInfo.title}
            {userId ? <div className="singleBookOpt">
              <LibWrap bookId={bookId} libraries={userLib} />
              <ShareBtn bookId={bookId} friends={friends} />
            </div> : <></>}
          </h1>
          <div className="singleBookInfo">
            <span className="singleAuthor">Author: <b>{bookInfo.author} </b></span>
            <span className="split">|</span>
            <span className="singlePub">{bookInfo.pubDate}</span>
            <span className="split">|</span>
            <span className="singleGenre">{bookInfo.genre}</span>
            <span className="split">|</span>
            <span className="ratingNum">{bookInfo.avgRating}</span>
            <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
          </div>
          <p className="singleBookDesc">
            {bookInfo.desc}
          </p>
        </span>
      </span>
      <div className="revSection">
        <div className="revHeader">
          <h>
            Reviews
          </h>
        </div>
        <MakeRev bookId={bookId} userId={userId} bookAvgRating={bookInfo.avgRating || "NA"} />
        <ShowRevs bookId={bookId} />
      </div>
    </div>
  )
}

export default Single