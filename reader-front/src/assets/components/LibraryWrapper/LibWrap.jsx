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

    if (libraries.wish.length > 0) {
        for( const id of wish) {
            if(bookId == id) {isWished = true;}
        }
    }
    if (libraries.own.length > 0) {
        for( const id of own) {
            if(bookId == id) {isOwned = true;}
        }
    }
    // if (libraries.fav.length > 0) {
    //     for( const id of fav) {
    //         if(bookId == id) {isWished = true;}
    //     }
    // }

    return (
        <Popup trigger={<button>+</button>} position="bottom center" className='libOptions'>
            <span className="btns">
                <FavBtn bookId={bookId} favRank={favRank}/>
                <WishBtn bookId={bookId} isWished={isWished}/>
                <OwnBtn bookId={bookId} isOwned={isOwned}/>
            </span>
        </Popup>
    )
}

export default LibWrap