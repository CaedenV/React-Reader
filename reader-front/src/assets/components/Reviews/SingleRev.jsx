import './singlerev.css';
import React, { useState } from 'react'

const SingleRev = ({ user, revTitle, revRating, revText }) => {
  const [overFlow, setOverFlow] = useState(false);
  const handleOverflow = (e) => {
    setOverFlow(true);
};
  
  return (
    <div className="review">
      <span className="reviewTitle">
      {user} | {revTitle} : {revRating}
        <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
      </span>
      <p className={`revDesc ${overFlow ? 'full' : ''}`}>
        {revText}
      </p>
    </div>
  )
}

export default SingleRev