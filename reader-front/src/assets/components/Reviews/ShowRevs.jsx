import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleRev from "./SingleRev";
import { revBack } from "../../backendRoutes";
import './singleRev.css';

const ShowRevs = ({bookId, getReviews, reviews}) => {
    return (
      <div className="revs">
        {reviews.length > 0 ? (
          <ul>{reviews.map((review, i) => (
              <SingleRev
                key={i}
                id={review.id}
                bookId={bookId}
                user={review.userName}
                revTitle={review.title}
                revRating={review.rating}
                revText={review.text}
                getReviews={getReviews}
              />))}
          </ul>
        ) : (
          <label>No reviews yet...</label>
        )}
  
      </div>
    )
}

export default ShowRevs;