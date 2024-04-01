import './profile.css';
import React from 'react';
import Popup from 'reactjs-popup';
import { useState, useEffect } from "react";
import { userBack, friendBack } from '../../backendRoutes';
import axios from "axios";
import { useParams } from 'react-router-dom';
import FriendList from '../../components/FriendList/FriendList';

const OtherProfile = ({ userId }) => {
    const [other, setUser] = useState({});
    const [otherFriends, setFriends] = useState([]);
    const [userFriends, setUserFriends] = useState([]);


    const [libNums, setLibNums] = useState({});
    const token = localStorage.getItem('token');
    const { profileId } = useParams();

    useEffect(() => {
        async function GetAllInfo() {
            await axios.get(`${friendBack}/getUser`, {
                body: { id: profileId },
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setFriends(response.data.friends);
                });
            await axios.get(`${friendBack}/getUser`, {
                body: { id: userId },
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setUserFriends(response.data.friends);
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
    }, [userId]);


    return (
        <form className="topCategory" >
            <div className="settingsProfPic">
                <img className="topProfile"
                    src={(other.userPicLink) || "https://static.vecteezy.com/system/resources/previews/000/348/518/original/vector-books-icon.jpg"} />
            </div>
            <div className="data">
                <div className="unFriends">
                    <label className='uName'>{other.userName}</label>

                    <Popup trigger={<button className="friends">Friends</button>} position="bottom center">
                        <ul>
                            <FriendList userFriends={userFriends} otherFriends={otherFriends} />
                        </ul>
                    </Popup>
                </div>
                <div className="favGenre">
                    <label className='title'>Favorite Genre:</label>
                    <label>{other.userFavGenre || " This user hasn't set their favorite genre."}</label>
                </div>
                <Link to={`/${userId}/library`}>
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
                </Link>
            </div>
        </form>
    )
}

export default OtherProfile