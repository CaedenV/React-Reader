import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import MakeRev from '../../components/Reviews/MakeRev';
import ShowRevs from '../../components/Reviews/ShowRevs';
import ShareBtn from '../../components/ShareBtn/ShareBtn';
import { bookBack, userBack } from '../../backendRoutes';

const Single = ({ userId }) => {
  const bookId = useParams();
  const [bookInfo, setBookInfo] = useState({});
  const [friends, setFriends] = useState([]);


  useEffect(() => {
    async function FetchAllInfo() {
      axios.get(`${bookBack}/${bookId}`)
        .then((response) => {
          setBookInfo(response.data[0]);
        });

      axios.get(`${userBack}${userId}/friends-list`)
        .then((response) => {
          setFriends(response.data.friends);
        });

    }
    FetchAllInfo();
  }, [bookId, userId]);
  const { BookCoverLink, BookTitle, BookAuthor, BookPubDate, BookAvgRating, BookDesc } = bookInfo;

  return (
    <div className="mainContents">
      <span className="bookCoverTitle">
        <img src={BookCoverLink}
          alt="Book Cover"
          className="singleBookCover"
        />
        <span className="bookDetails">
          <h1 className="singleBookTitle"> {BookTitle}
            {userId ? <div className="singleBookOpt">
              {/* <AddOwnButton bookId={bookId} />
                <AddWishButton bookId={bookId} /> */}
              <ShareBtn bookId={bookId} friends={friends} />
            </div> : <></>}
          </h1>
          <div className="singleBookInfo">
            <span className="singleAuthor">Author: <b>{BookAuthor} </b></span>
            <span className="split">|</span>
            <span className="singlePub">{BookPubDate}</span>
            <span className="split">|</span>
            <i className="singleLen fa-solid fa-scroll"></i>
            <span className="split">|</span>
            <span className="ratingNum">{BookAvgRating || 0}</span>
            <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
          </div>
          <p className="singleBookDesc">
            {BookDesc}
          </p>
        </span>
      </span>
      <div className="revSection">
        <div className="revHeader">
          <h>
            Reviews
          </h>
        </div>
        <MakeRev bookId={bookId} userId={userId} bookAvgRating={BookAvgRating || "NA"} />
        <ShowRevs bookId={bookId} />
      </div>
    </div>
  )
}

export default Single