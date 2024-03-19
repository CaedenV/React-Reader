import './notifsingle.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotifSingle = ({sender, bookTitle, bookCover, senderPic, time}) => {
    return (
        <div className='notif'>
            <div className="pics">
                <img src={bookCover} alt={bookTitle} className='bookPic'/>
                <img src={senderPic} alt={sender} className='senderPic'/>
            </div>
            <label className="msg">{sender} recommends <Link to={`${bookId}`} className='bookLink'>{bookTitle}</Link></label>
            <label>{time}</label>
        </div>
    )
}

export default NotifSingle