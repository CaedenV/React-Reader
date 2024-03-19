import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleRev from "./SingleRev";
import { revBack } from "../../backendRoutes";

const ShowRevs = ({bookId}) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
      async function getReviews() {
        axios.get(`${revBack}/${bookId}`)
        .then((response) => {
          setReviews(response.data);
        });
      } 
      
      getReviews();
      setInterval(getReviews, 60000);
    }, [bookId]);
  
    return (
      <div>
        {reviews.length > 0 ? (
          <ul>
            <li>{reviews.map((review, i) => (
              <SingleRev
                key={i}
                user={review.ReviewUserId}
                revTitle={review.ReviewTitle}
                revRating={review.ReviewRating}
                revText={review.ReviewText}
              />))}</li>
          </ul>
        ) : (
          <label>No reviews yet...</label>
        )}
  
      </div>
    )
}

export default ShowRevs