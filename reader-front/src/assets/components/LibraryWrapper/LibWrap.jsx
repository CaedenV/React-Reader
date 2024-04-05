import './libwrap.css';
import React, { useState } from 'react';
import FavBtn from './LibraryAddBtns/FavBtn';
import WishBtn from './LibraryAddBtns/WishBtn';
import OwnBtn from './LibraryAddBtns/OwnBtn';

const LibWrap = ({ libraries, bookId }) => {
    const [active, setActive] = useState(false);
    let isWished = false;
    let isOwned = false;
    let favRank = 0;

    if (libraries.wished) {
        for (const id of libraries.wished) {
            if (bookId == id) { isWished = true; }
        }
    }
    if (libraries.owned) {
        for (const id of libraries.owned) {
            if (bookId == id) { isOwned = true; }
        }
    }
    if (libraries.fav) {
        for (const obj of fav) {
            if (bookId == obj.id) { favRank = obj.rank; }
        }
    }

    return (
        <div className="wrap">
            {active ?
                <div className="btns">
                    <button className='display' onClick={() => setActive(!active)}> + </button>
                    <FavBtn bookId={bookId} favRank={favRank} />
                    <WishBtn bookId={bookId} isWished={isWished} />
                    <OwnBtn bookId={bookId} isOwned={isOwned} />
                </div> : <button className='display' onClick={() => setActive(!active)}> + </button>}
        </div>

    )
}

export default LibWrap