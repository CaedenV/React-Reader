import './notiflist.css';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { notifBack } from '../../backendRoutes';
import NotifSingle from './NotifSingle';
import apiClient from '../../axiosTokenIntercept';

const NotifList = ({ userId }) => {
    const [notifs, setNotifs] = useState({});
    const [tab, setTab] = useState(0);
    const [fresh, setFresh] = useState(0);


    useEffect(() => {
        async function getNotifs() {
            await apiClient.get(`${notifBack}/getByUser`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
                .then((response) => { setNotifs(response.data.notifs); });

            await apiClient.get(`${notifBack}/getNumByUser`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }).then((response) => { setFresh(response.data.notifs); });

        }
        getNotifs();
        setInterval(getNotifs, 1000);
    }, [userId]);

    return (
        <Popup trigger={<button className='trigger'><i className="notifsBtn fa-solid fa-bell"/> <label className='num'>{fresh > 0 ? fresh : " "}</label></button>} position="bottom center" >
            <div className='userNotifs'>
                {notifs.recs && notifs.friendReq && notifs.sysMessage ?
                    <div className="tabs">
                        <div className="tabBtns">
                            <button onClick={() => setTab(0)} className={tab === 0 ? 'active' : 'tab'}>Books</button>
                            <button onClick={() => setTab(1)} className={tab === 1 ? 'active' : 'tab'}>Friends</button>
                            <button onClick={() => setTab(2)} className={tab === 2 ? 'active' : 'tab'}>Other</button>
                        </div>
                        <div className="tab-content">
                            {tab === 0 ? notifs.recs.length > 0 ?
                                <span>{notifs.recs.map((notif, i) => (
                                    <NotifSingle
                                        key={i}
                                        friend={JSON.parse(notif.friendRequest)}
                                        book={JSON.parse(notif.book)}
                                        time={notif.createdAt}
                                        read={notif.notifRead}
                                        type={notif.notifType}
                                        notifId={notif.id}
                                    />))}
                                </span> : <label>No Book notifications.</label>
                                :
                                <></>
                            }
                            {tab === 1 ? notifs.friendReq.length > 0 ?
                                <span>{notifs.friendReq.map((notif, i) => (
                                    <NotifSingle
                                        key={i}
                                        friend={JSON.parse(notif.friendRequest)}
                                        read={notif.notifRead}
                                        time={notif.createdAt}
                                        type={notif.notifType}
                                        notifId={notif.id}
                                    />))}
                                </span> : <label>0 Active Friend Requests.</label>
                                :
                                <></>
                            }
                            {tab === 2 ? notifs.sysMessage.length > 0 ?
                                <span>{notifs.sysMessage.map((notif, i) => (
                                    <NotifSingle
                                        key={i}
                                        message={notif.message}
                                        read={notif.notifRead}
                                        time={notif.createdAt}
                                        type={notif.notifType}
                                        notifId={notif.id}
                                    />))}
                                </span> : <label>Nothing to report!</label>
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