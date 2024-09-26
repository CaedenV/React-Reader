import { revBack } from '../../backendRoutes';
import './singlerev.css';
import apiClient from '../../axiosTokenIntercept';
import React, { useEffect, useState } from 'react';

const SingleRev = ({ user, id, bookId, revTitle, revRating, revText, revDate, getReviews }) => {
  const [overFlow, setOverFlow] = useState(false);
  const [userWrote, setUserWrote] = useState(false);
  const token = localStorage.getItem('accessToken');

  const handleOverflow = () => {
    setOverFlow(true);
  };

  const handleRemoveClick = async () => {
    try {
      await apiClient.delete(`${revBack}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {bookId, id}
      });

      getReviews();
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  useEffect(() => {
    async function fetchUserWrote() {
      try {
        const userResponse = await apiClient.get(`${revBack}/userWrote/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserWrote(userResponse.data.userWrote);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    fetchUserWrote();
  }, [user])

  return (
    <div className="reviewCard" onClick={() => handleOverflow}>
      <header className="reviewHeader">
        <div className="userInfo">
        {userWrote && <button className='revRemove' onClick={handleRemoveClick}><i className="fa-solid fa-trash-can" /></button>}
        <h2 className="userName">{user}</h2>
        </div>
        <div className="ratingContainer">
          <span className='rating'>{revRating}</span>
          <i className="reviewIcon fa-solid fa-star-half-stroke" />
        </div>
        <div className="reviewMeta">
          <h3 className='reviewTitle'>{revTitle}</h3>
          <time className='reviewDate'>{revDate}</time>
        </div>
      </header>
      <p className={`revDesc ${overFlow ? 'full' : ''}`}>{revText}</p>
    </div>
  )
}

export default SingleRev