import './profile.css';
import React from 'react';
import Popup from 'reactjs-popup';
import { useState, useEffect } from "react";
import { userBack, friendBack } from '../../backendRoutes';
import profPic from '../../profPic.png';
import axios from "axios";
import { useParams } from 'react-router-dom';
import FriendList from '../../components/FriendList/FriendList';

const OtherProfile = ({ userId }) => {
    const { userName } = useParams();
    const [other, setOther] = useState({});
    const [otherFriends, setOtherFriends] = useState([]);
    const [libNums, setLibNums] = useState({});

    const [userFriends, setUserFriends] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function GetMainInfo() {
            await axios.get(`${userBack}/getOther/${userName}`, {          // gets the necessary profile information
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                setOther(response.data.user);
            });
            await axios.get(`${userBack}/libCount/${userName}`, {         // gets the library count of the profile
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                const data = {
                    own: response.data.library.owned,
                    fav: response.data.library.faved,
                    wish: response.data.library.wished
                };
                setLibNums(data);
            });
        }
        async function GetFriends() {
            await axios.get(`${friendBack}/getOther/${userName}`, {      // gets the friends of the viewed profile
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                setOtherFriends(response.data.friends);
            });
            await axios.get(`${friendBack}/getUser`, {                  // gets the friends of the user
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                setUserFriends(response.data.friends);
            });
        }
        GetFriends();
        GetMainInfo();
        setInterval(GetFriends, 60000);
    }, [userId]);


    return (
        <div className="topCategory" >
            <div className="settingsProfPic">
                <img className="topProfile"
                    src={(other.pic) || profPic} />
            </div>
            <div className="data">
                <div className="unFriends">
                    <label className='uName'>{userName}</label>

                    <Popup trigger={<button className="friends">Friends</button>} position="bottom center">
                        <div className="listPop">
                            <FriendList userFriends={userFriends} otherFriends={otherFriends} userId={userId} />
                        </div>
                    </Popup>
                </div>
                <div className="favGenre">
                    <label className='title'>Favorite Genre:</label>
                    <label>{other.favGenre || " This user hasn't set their favorite genre."}</label>
                </div>

                <div className="libNums">
                    {other.nowRead ? <div className="nowRead">
                        <label className='cat'>Currently Reading:</label>
                        <SmallBook bookId={other.nowRead} />
                    </div> : <></>}
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
        </div>
    )
}

export default OtherProfile