import './addbtns.css';
import React, { useState } from 'react';
import { favBack } from '../../../backendRoutes';

const FavBtn = ({ bookId, favRank }) => {
    const [isFav, setIsFav] = useState(false);

    const unFavorite = async () => {
        await axios.delete(`${favBack}/delete`, {
            bookId: bookId,
        });
        favRank = 0;
        setIsFav(false);
    };

    const getRank = async () => {
        setIsFav(true);
    }

    const setFavorite = async () => {

        const response = await axios.post(`${favBack}/add`, {
            bookId: bookId,
            rank: favRank,
        });
        favRank = response.data[0];
        console.log(favRank);
    }

    return (
        <div className="button">
            {favRank != 0 ?
                (<button className="fav undo" onClick={unFavorite}><i class="fa-solid fa-heart"> {favRank}</i></button>)
                :
                (
                    <>
                        <button className="fav" onClick={getRank}> <i class="fa-regular fa-heart"></i> </button>
                        {isFav ?
                            (<input type="integer" className="Fav Rank" value={"0"} onChange={setFavorite} />)
                            :
                            (<></>)
                        }
                    </>
                )}
        </div>
    )
}

export default FavBtn