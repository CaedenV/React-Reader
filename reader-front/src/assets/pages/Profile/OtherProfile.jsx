import './profile.css';
import React from 'react';
import Popup from 'reactjs-popup';
import { useState, useEffect } from "react";
import { userBack, friendBack } from '../../backendRoutes';
import axios from "axios";
import { useParams } from 'react-router-dom';

const OtherProfile = () => {
    const [user, setUser] = useState({});
    const [friends, setFriends] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const [libNums, setLibNums] = useState({});
    const token = localStorage.getItem('token');
    const { profileId } = useParams();

    useEffect(() => {
        async function GetAllInfo() {
            await axios.get(`${friendBack}/get`, {
                body: { id: profileId },
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setFriends(response.data.friends);
                });
            await axios.get(`${userBack}/getUser`, {
                body: { id: profileId },
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => { setUser(response.data.user); });
            await axios.get(`${userBack}/selfLibCount`, {
                body: { id: profileId },
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    const data = {
                        own: response.data.library.owned,
                        fav: response.data.library.faved,
                        wish: response.data.library.wished
                    };
                    setLibNums(data);
                });
        }

        GetAllInfo();
        //TO DO: Add dependency on the viewed profile's Id AND userId
    }, [userId]);

    const handleAdd = () => {
        //TO DO: get name from li item
        axios.post(`${friendBack}/add`, {
            body: { friend: friendName },
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            setUserFriends(response.data.friends);
        });
        //TO DO: get name from li item
    }

    return (
        <form className="topCategory" >
            <div className="settingsProfPic">
                <img className="topProfile"
                    src={(user.userPicLink) || "https://static.vecteezy.com/system/resources/previews/000/348/518/original/vector-books-icon.jpg"} />
            </div>
            <div className="data">
                <div className="unFriends">
                    <label className='uName'>{user.userName}</label>

                    <Popup trigger={<button className="friends">Friends</button>} position="bottom center">
                        <ul>
                            {friends.map((friend, i) => (
                                <li key={i}>
                                    {friend.name} <button className='add' onClick={handleAdd}>+</button>
                                    {/* determine whether in both user's and viewed profile's */}
                                </li>
                            ))}
                        </ul>
                    </Popup>
                </div>
                <div className="favGenre">
                    <label className='title'>Favorite Genre:</label>
                    <label>{user.userFavGenre || " This user hasn't set their favorite genre."}</label>
                </div>
                <div className="libNums">
                    <div className="lib owns">
                        <label className='cat'> Owns </label>
                        <label className='value'> {libNums.own} </label>
                    </div>
                    <div className="lib favs">
                        <label className='cat'> Favorites </label>
                        <label className='value'> {libNums.fav} </label>
                    </div>
                    <div className="lib wishes">
                        <label className='cat'> Wishlist </label>
                        <label className='value'> {libNums.wish} </label>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default OtherProfile