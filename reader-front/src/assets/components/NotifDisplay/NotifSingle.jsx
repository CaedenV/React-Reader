import './notifsingle.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NotifSingle = ({ friend, book, time, read, message, type }) => {
    const {cover, title, bookId} = book;
    const {pic, userName, friendId} = friend;
    const [status, setStatus] = useState(false);
    
    onAccept = () => {
        //Add pair to friends table
        setStatus(true);
    }

    return (
        <div className='notif'>
            <div className="pics">
                <img src={cover} alt={title} className='bookPic' />
                <img src={pic} alt={userName} className='senderPic' />
            </div>
            {type === 'book' && <label className="msg">{userName} recommends <Link to={`/view/${bookId}`} className='links'>{title}!</Link> {read}</label>}
            {type === 'friend' &&
                <div className="friend">
                    <label className="msg"><Link to={`/${friendId}/profile`} className='links'>{userName}</Link> would like to be your friend! {read}</label>
                    { !status && <button onClick={onAccept}><i class="fa-solid fa-circle-check"/></button>}
                </div>
            }
            {type === 'sys' && <label className="msg">{message} {read}</label>}

            <label>{time}</label>
        </div>
    )
}

export default NotifSingle