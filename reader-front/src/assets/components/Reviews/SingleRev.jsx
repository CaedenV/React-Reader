import { revBack } from '../../backendRoutes';
import './singlerev.css';
import apiClient from '../../axiosTokenIntercept';
import React, { useEffect, useState } from 'react';

const SingleRev = ({ user, id, bookId, revTitle, revRating, revText, getReviews }) => {
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
    <div className="review" onClick={() => handleOverflow}>
      {userWrote && <button className='revRemove' onClick={handleRemoveClick}><i className="fa-solid fa-eraser" /></button>}
      <div className="revInfo">
        <span className="reviewTitle">
          {user} | {revTitle} : {revRating}
          <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
        </span>
        <p className={`revDesc ${overFlow ? 'full' : ''}`}>
          {revText}
        </p>
      </div>
    </div>
  )
}

export default SingleRev