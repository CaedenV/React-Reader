import './notifsingle.css';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { notifBack } from '../../backendRoutes';
import NotifSingle from './NotifSingle';
import axios from 'axios';

const NotifList = ({ userId }) => {
    const [notifs, setNotifs] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function getNotifs() {
            console.log(userId, token);
            axios.get(`${notifBack}/getByUser`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => { setNotifs(response.data.notifs); });
        }

        getNotifs();
        setInterval(getNotifs, 60000);
    }, [userId]);

    return (
        <Popup trigger={<button><i className="notifsBtn fa-solid fa-bell"></i></button>} position="bottom center">
            <div className="userNotifs">
                {notifs.length > 0 ? (
                    <ul>
                        <li>{notifs.map((notif, i) => (
                            <NotifSingle
                                key={i}
                                sender={notif.sender}
                                senderPic={notif.senderPic}
                                bookTitle={notif.bookTitle}
                                bookCover={notif.cover}
                                time={notif.time}
                            />))}</li>
                    </ul>
                ) : (
                    <></>
                )}
            </div>
        </Popup>
    )
}

export default NotifList