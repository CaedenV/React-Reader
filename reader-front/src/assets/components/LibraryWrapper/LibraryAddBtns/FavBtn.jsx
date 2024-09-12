import './addbtns.css';
import React, { useState } from 'react';
import { favBack } from '../../../backendRoutes';
import axios from 'axios';

const FavBtn = ({ bookId, favRank }) => {
    const [isFav, setIsFav] = useState(false);
    const [rank, setRank] = useState(favRank);
    const token = localStorage.getItem('token');

    const unFavorite = async () => {
        await axios.delete(`${favBack}/remove/${bookId}`, {
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
        const formData = new FormData(e.target);
        const r = formData.get('rank');
        setRank(r);
        const book = { bookId: bookId, rank: r };
        await axios.post(`${favBack}/add`, { book: book }, {

            headers: { Authorization: `Bearer ${token}` }
        });
    }

    return (
        <div className="button">
            {rank != 0 ?
                (<button className="fav undo" onClick={unFavorite}><i className="fa-solid fa-heart"> {rank}</i></button>)
                :
                (
                    <span className='getRank'>
                        <button className="add fav" onClick={getRank}><i className="fa-regular fa-heart" /></button>
                        {isFav ?
                            (<form onSubmit={setFavorite} >
                                <input type="integer" className="Fav Rank" name='rank' placeholder={favRank} />
                            </form>
                            )
                            :
                            (<></>)
                        }
                    </span>
                )}
        </div>
    )
}

export default FavBtn