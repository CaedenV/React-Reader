import './notifsingle.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { friendBack, notifBack } from '../../backendRoutes';

const NotifSingle = ({ friend, book, time, read, message, type, key}) => {
    const { cover, title, bookId } = book || {};
    const { pic, userName, friendId } = friend || {};
    const [reqAccept, setReqAccept] = useState(friend.accept);
    const [status, setStatus] = useState(read);
    const token = localStorage.getItem('token');

    const onAccept = async () => {
        //Add pair to friends table
        friend.accept = true;
        await axios.post(`${friendBack}/add`, {
            body: { friend: friend.id },
            headers: { Authorization: `Bearer ${token}` }
        });
        await axios.patch(`${notifBack}/acceptFriend/${key}`, {
            body: friend,
            headers: { Authorization: `Bearer ${token}` }
        })
        setReqAccept(!reqAccept);
    }
    const handleRemove = async () => {
        await axios.post(`${notifBack}/delete/${key}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    const handleRead = async () => {
        await axios.post(`${notifBack}/read/${key}`, {
            body: { notifRead: true },
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            setStatus(response.body.status);
        });
    }

    return (
        <div className={status ? 'old' : 'fresh'} onClick={handleRead}>
            <div className="pics">
                {book && <img src={cover} alt={title} className='bookPic' />}
                <img src={pic} alt={userName} className='senderPic' />
            </div>
            {type === 'book' && book && <label className="msg">{userName} recommends <Link to={`/view/${bookId}`} className='links'>{title}!</Link></label>}
            {type === 'friend' && friend &&
                <div className="friend">
                    {!reqAccept ?
                        <>
                            <label className="msg"><Link to={`/${friendId}/profile`} className='links'>{userName}</Link> would like to be your friend!</label>
                            <button onClick={onAccept}><i class="fa-solid fa-circle-check" /></button>
                        </> :
                        <label className="msg">You and <Link to={`/${friendId}/profile`} className='links'>{userName}</Link> are now friends!</label>
                    }
                </div>
            }
            {type === 'sys' &&  message && <label className="msg">{message}</label>}
            <div className="extra">
                <label>{time}</label>
                <button className="remove" onClick={handleRemove}>X</button>
            </div>
        </div>
    )
}

export default NotifSingle