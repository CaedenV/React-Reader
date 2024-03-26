import './libwrap.css';
import React from 'react';
import Popup from 'reactjs-popup';
import FavBtn from './LibraryAddBtns/FavBtn';
import WishBtn from './LibraryAddBtns/WishBtn';
import OwnBtn from './LibraryAddBtns/OwnBtn';

const LibWrap = ({libraries, bookId }) => {
    let isWished = false;
    let isOwned = false;
    let favRank = 0;

    if (libraries.wished) {
        for( const id of libraries.wished) {
            if(bookId == id) {isWished = true;}
        }
    }
    if (libraries.owned) {
        for( const id of libraries.owned) {
            if(bookId == id) {isOwned = true;}
        }
    }
    if (libraries.fav) {
        for( const obj of fav) {
            if(bookId == obj.id) {favRank = obj.rank;}
        }
    }

    return (
        <Popup trigger={<button className='display'> + </button>} position="middle left" className='libOptions'>
            <span className="btns">
                <FavBtn bookId={bookId} favRank={favRank}/>
                <WishBtn bookId={bookId} isWished={isWished}/>
                <OwnBtn bookId={bookId} isOwned={isOwned}/>
            </span>
        </Popup>
    )
}

export default LibWrap