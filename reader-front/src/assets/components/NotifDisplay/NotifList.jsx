import './notiflist.css';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { notifBack } from '../../backendRoutes';
import NotifSingle from './NotifSingle';
import axios from 'axios';

const NotifList = ({ userId }) => {
    const [notifs, setNotifs] = useState({});
    const [tab, setTab] = useState(0);
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function getNotifs() {
            axios.get(`${notifBack}/getByUser`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => { setNotifs(response.data.notifs); });
        }

        getNotifs();
        setInterval(getNotifs, 60000);
    }, [userId]);

    return (
        <Popup trigger={<button><i className="notifsBtn fa-solid fa-bell"></i></button>} position="bottom center" >
            <div className='userNotifs'>
                {notifs.reccs && notifs.friendReq && notifs.sysMessage ?
                    <div className="tabs">
                        <div className="tabBtns">
                            <button onClick={() => setTab(0)} className={tab === 0 ? 'active' : 'tab'}>Books</button>
                            <button onClick={() => setTab(1)} className={tab === 1 ? 'active' : 'tab'}>Friends</button>
                            <button onClick={() => setTab(2)} className={tab === 2 ? 'active' : 'tab'}>Other</button>
                        </div>
                        <div className="tab-content">
                            {tab === 0 ? notifs.reccs.length > 0 ?
                                <ul>
                                    <li>{notifs.reccs.map((notif) => (
                                        <NotifSingle
                                            key={notif.id}
                                            friend={notif.friendRequest}
                                            book={notif.book}
                                            time={notif.createdAt}
                                            read={notif.notifRead}
                                            type={notif.type}
                                        />))}</li>
                                </ul> : <label>No Book notifications.</label>
                                :
                                <></>
                            }
                            {tab === 1 ? notifs.friendReq.length > 0 ?
                                <ul>
                                    <li>{notifs.friendReq.map((notif) => (
                                        <NotifSingle
                                            key={notif.id}
                                            friend={notif.friendRequest}
                                            read={notif.notifRead}
                                            time={notif.createdAt}
                                            type={notif.type}
                                        />))}</li>
                                </ul> : <label>0 Active Friend Requests.</label>
                                :
                                <></>
                            }
                            {tab === 2 ? notifs.sysMessage.length > 0 ?
                                <ul>
                                    <li>{notifs.sysMessage.map((notif) => (
                                        <NotifSingle
                                            key={notif.id}
                                            message={notif.message}
                                            read={notif.notifRead}
                                            time={notif.createdAt}
                                            type={notif.type}
                                        />))}</li>
                                </ul> : <label>Nothing to report!</label>
                                :
                                <></>
                            }

                        </div>
                    </div>
                    : <></>}
            </div>
        </Popup>
    )
}

export default NotifList