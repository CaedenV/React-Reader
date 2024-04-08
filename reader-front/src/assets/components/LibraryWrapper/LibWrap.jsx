import './libwrap.css';
import React, { useEffect, useState } from 'react';
import FavBtn from './LibraryAddBtns/FavBtn';
import WishBtn from './LibraryAddBtns/WishBtn';
import OwnBtn from './LibraryAddBtns/OwnBtn';

const LibWrap = ({ libraries, bookId }) => {
    const [active, setActive] = useState(false);
    const [isWished, setWished] = useState(false);
    const [isOwned, setOwned] = useState(false);
    const [favRank, setRank] = useState(0);
    
    useEffect(() => {
        if (libraries.wished) {
            for (const obj of libraries.wished) {
                if (bookId == obj.bookId) { setWished(true); }
            }
        }
        if (libraries.owned) {
            for (const obj of libraries.owned) {
                if (bookId == obj.bookId) { setOwned(true); }
            }
        }
        if (libraries.faved) {
            for (const obj of libraries.faved) {
                if (bookId == obj.bookId) { setRank(obj.bookRank); }
            }
        }
        //console.log(bookId + ": wished " + isWished + ", faved " + favRank + ", owned: " + isOwned);
    }, [libraries]);

    

    return (
        <div className="wrap">
            {active ?
                <div className="btns">
                    <button className='display' onClick={() => setActive(!active)}> - </button>
                    <FavBtn bookId={bookId} favRank={favRank} />
                    <WishBtn bookId={bookId} isWished={isWished} />
                    <OwnBtn bookId={bookId} isOwned={isOwned} />
                </div> : <button className='display' onClick={() => setActive(!active)}> + </button>}
        </div>

    )
}

export default LibWrap