import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleRev from "./SingleRev";
import { revBack } from "../../backendRoutes";

const ShowRevs = ({bookId}) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
      async function getReviews() {
        axios.get(`${revBack}/getByBook/${bookId}`)
        .then((response) => {
          setReviews(response.data.revs);
        });
      } 
      
      getReviews();
      setInterval(getReviews, 60000);
    }, [bookId]);
  
    return (
      <div>
        {reviews.length > 0 ? (
          <ul>{reviews.map((review, i) => (
              <SingleRev
                key={i}
                user={review.user}
                revTitle={review.title}
                revRating={review.rating}
                revText={review.text}
              />))}
          </ul>
        ) : (
          <label>No reviews yet...</label>
        )}
  
      </div>
    )
}

export default ShowRevs