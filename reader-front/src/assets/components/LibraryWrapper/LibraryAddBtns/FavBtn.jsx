import './addbtns.css';
import React, { useState } from 'react';
import { favBack } from '../../../backendRoutes';
import axios from 'axios';

const FavBtn = ({ bookId, favRank }) => {
    const [isFav, setIsFav] = useState(false);
    const [rank, setRank] = useState(favRank || 0);
    const token = localStorage.getItem('token');

    const unFavorite = async () => {
        await axios.delete(`${favBack}/delete`, {
            body: {bookId: bookId},
            headers: { Authorization: `Bearer ${token}` }
          });
        setRank(0);
        setIsFav(false);
    };

    const getRank = async () => {
        setIsFav(true);
    }

    const setFavorite = async (e) => {
        e.preventDefault();
        setRank(e.target.value);
        console.log(rank);
        const book = {bookId: bookId, rank: rank};
        console.log(book);
        await axios.post(`${favBack}/add`, {book: book}, {
            
            headers: { Authorization: `Bearer ${token}` }
          });
        console.log(rank);
    }

    return (
        <div className="button">
            {rank != 0 ?
                (<button className="fav undo" onClick={unFavorite}><i className="fa-solid fa-heart"> {rank}</i></button>)
                :
                (
                    <>
                        <button className="add fav" onClick={getRank}> <i className="fa-regular fa-heart" /> </button>
                        {isFav ?
                            (<input type="integer" className="Fav Rank" value={rank} onChange={(e) => setFavorite(e)} />)
                            :
                            (<></>)
                        }
                    </>
                )}
        </div>
    )
}

export default FavBtn