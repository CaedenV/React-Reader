import React from "react";
import SingleRev from "./SingleRev";
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