import './notifsingle.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { friendBack, notifBack, backend } from '../../backendRoutes';
import axios from 'axios';

const NotifSingle = ({ friend, book, time, read, message, type, notifId }) => {
    const { cover, title, id } = book || {};
    const { userName } = friend || {};
    const [reqAccept, setReqAccept] = useState(friend.accept);
    const [status, setStatus] = useState(read);
    const token = localStorage.getItem('token');

    const getTime = (timestamp) => {
        const givenTimestamp = new Date(Date.parse(timestamp));
        const diffInMilliseconds = Date.now() - givenTimestamp.getTime();
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);

        if (diffInYears > 0) {
            return `${diffInYears} years ago`;
        } else if (diffInMonths > 0) {
            return `${diffInMonths} months ago`;
        } else if (diffInWeeks > 0) {
            return `${diffInDays} week(s) ago`;
        } else if (diffInDays > 0) {
            return `${diffInDays} days ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour(s) ago`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} min(s)  ago`;
        } else {
            return `${diffInSeconds} sec(s) ago`;
        }
    };

    const onAccept = async () => {
        //Add pair to friends table
        friend.accept = true;
        await axios.post(`${friendBack}/add`, { friendName: userName }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        await axios.patch(`${notifBack}/acceptFriend/${notifId}`, { friend: friend }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReqAccept(true);
    }
    const handleRemove = async () => {
        await axios.delete(`${notifBack}/delete/${notifId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    const handleRead = async () => {
        await axios.patch(`${notifBack}/read/${notifId}`, { notifRead: !status }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            setStatus(response.data.status);
        });
    }

    return (
        <div className={status ? 'old' : 'fresh'} onClick={handleRead}>
            <div className="pics">
                {book && <img src={`${backend}${cover}`} alt={title} className='bookPic' />}
                <img src={`${backend}${friend.pic}`} className='senderPic' />
            </div>
            {type === 'book' && book && <label className="msg">{userName} recommends <Link to={`/view/${bookId}`} className='links'>{title}!</Link></label>}
            {type === 'friend' && friend &&
                <div className="friend">
                    {!reqAccept ?
                        <>
                            <label className="msg"><Link to={`/profile/${userName}`} className='links'>{userName}</Link> would like to be your friend!</label>
                            <button onClick={onAccept}><i className="fa-solid fa-circle-check" /></button>
                        </> :
                        <label className="msg">You and <Link to={`/profile/${userName}`} className='links'>{userName}</Link> are now friends!</label>
                    }
                </div>
            }
            {type === 'sys' && message && <label className="msg">{message}</label>}
            <label className='time'>{getTime(time)}</label>
            <button className="remove" onClick={handleRemove}>X</button>
        </div>
    )
}

export default NotifSingle