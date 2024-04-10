import './makerev.css';
import React, { useState } from 'react';
import axios from 'axios';
import { revBack } from '../../backendRoutes';

const MakeRev = ({ bookId }) => {
    const [rating, setRating] = useState(null);
    const token = localStorage.getItem('token');

    const handleRatingChange = (event) => {
        setRating(Number(event.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rev = {
            book: bookId,
            title: formData.get('title'),
            text: formData.get('text'),
            rating: rating,
        }
        await axios.post(`${revBack}/add`, { review: rev }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRating(null);
        e.target.reset();
    };

    return (
        <div className="make">
            <form className="makeReview" onSubmit={handleSubmit}>
                <div className="makeRevGrp">
                    <input type="text" name='title' placeholder="How about a title?" className="revInput" autoFocus={true}
                    />
                    <div className="star-rating">
                        {[...Array(5)].map((_, index) => (
                            <label key={index} className={`star-label ${rating > index ? 'filled' : ''}`}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={index + 1}
                                    checked={rating === index + 1}
                                    onChange={handleRatingChange}
                                    className="star-input"
                                />
                                {rating > index ? (
                                    <i className="fa-solid fa-star"></i>
                                ) : (
                                    <i className="fa-regular fa-star"></i>
                                )}
                            </label>
                        ))}
                        <p>{rating}</p>
                    </div>
                    <button className='revSubmit' type='submit'><i className=" fa-solid fa-pen-nib"></i></button>
                </div>
                <div className="makeRevText">
                    <textarea name='text' placeholder="How was it? Let us know in more detail..." type="text" className="revInput revText"></textarea>
                </div>
            </form>
        </div>
    )
}

export default MakeRev