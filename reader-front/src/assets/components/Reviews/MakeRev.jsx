import './makerev.css';
import React from 'react';
import axios from 'axios';
import { revBack } from '../../backendRoutes';

const MakeRev = ({ bookId, userId }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rev = {
            title: formData.get('title'),
            text: formData.get('text'),
            rating: formData.get('rating'),
            userId: userId
        }
        const response = await axios.post(`${revBack}/${bookId}`, rev);
        // const oldAvg = (response.data.oldAvg[0].BookAvgRating) || 0;
        // const numRevs = response.data.numRevs[0].count;
        // if(numRevs == 0) {
        //     bookAvgRating = (oldAvg + reviewRating) / 1;
        // }

        // await axios.put(`http://localhost:8000/books/${bookId}/avgRating`, {newAvg: bookAvgRating})
        //     .then((response) => console.log(response.data.message)
        // );

    };

    return (
        <div className="make">
            <form className="makeReview" onSubmit={handleSubmit}>
                <div className="makeRevGrp">
                    <input type="text" name='title' placeholder="How about a title?" className="revInput" autoFocus={true}
                    />
                    <div class="star-rating">
                        <i class="fa-solid fa-star" data-star-index="1"></i>
                        <i class="fa-solid fa-star" data-star-index="2"></i>
                        <i class="fa-solid fa-star" data-star-index="3"></i>
                        <i class="fa-solid fa-star" data-star-index="4"></i>
                        <i class="fa-solid fa-star" data-star-index="5"></i>
                    </div>
                    <hr />
                </div>
                <div className="makeRevText">
                    <textarea name='text' placeholder="How was it? Let us know in more detail..." type="text" className="revInput revText"></textarea>
                </div>
                <button className='revSubmit' type='submit'><i class=" fa-solid fa-pen-nib"></i></button>
            </form>
        </div>
    )
}

export default MakeRev