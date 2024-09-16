import './profile.css';
import React from 'react';
import Popup from 'reactjs-popup';
import { useState, useEffect } from "react";
import { userBack, friendBack, revBack } from '../../backendRoutes';
import profPic from '../../profPic.png';
import apiClient from '../../axiosTokenIntercept';
import { useParams } from 'react-router-dom';
import FriendList from '../../components/FriendList/FriendList';

const OtherProfile = ({ userId }) => {
    const { userName } = useParams();
    const [other, setOther] = useState({});
    const [otherFriends, setOtherFriends] = useState([]);
    const [libNums, setLibNums] = useState({});
    const [userRevs, setUserRevs] = useState({});
    const [pendingFriends, setPendingFriends] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        async function GetMainInfo() {
            await apiClient.get(`${userBack}/getOther/${userName}`, {          // gets the necessary profile information
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                setOther(response.data.user);
            });
            await apiClient.get(`${userBack}/libCount/${userName}`, {         // gets the library count of the profile
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
            await apiClient.get(`${friendBack}/getOther/${userName}`, {      // gets the friends of the viewed profile
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                setOtherFriends(response.data.friends);
            });
            await apiClient.get(`${friendBack}/getUser`, {                  // gets the friends of the user
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                setUserFriends(response.data.friends);
            });
        }
        GetFriends();
        GetMainInfo();
    }, [userId, userName]);

    useEffect(() => {
        async function getRevs() {
            await apiClient.get(`${revBack}/user/${userName}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => { setUserRevs(response.data.userRevs); });
        }

        getRevs();
        //console.log(userRevs);
    }, [userName]);


    const handlePendingChange = (friend, pending) => {
        setPendingFriends(prevPendingFriends => {
            const newPendingFriends = [...prevPendingFriends];
            const index = newPendingFriends.findIndex(f => f.id === friend.id);
            if (index !== -1) {
                newPendingFriends[index] = { ...newPendingFriends[index], pending };
            } else {
                newPendingFriends.push({ ...friend, pending });
            }
            return newPendingFriends;
        });
    };


    return (
        <div className="profilePage">
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
                                <FriendList userFriends={userFriends} otherFriends={otherFriends} userId={userId} pendingFriends={pendingFriends} onPendingChange={handlePendingChange} />
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
            <div className="userRevs">
                {userRevs && userRevs.length > 0 ?
                    <h1 className="revListTitle"> {userName}'s Reviews</h1> :
                    <h1 className="revListTitle">{userName} hasn't left any reviews. Help them out!</h1>
                }

                {userRevs && userRevs.length > 0 &&
                    <ul>{userRevs.map((review, i) => (
                        <li className="rev" key={i}>
                            <Link className="rev" to={`/view/${review.bookId}`}>
                                <span className="bookInfo">{review.bookTitle}: {review.author}</span> |
                                <span className="revInfo">{review.revTitle}: {review.rating}/5<i className="reviewIcon fa-solid fa-star-half-stroke" /></span>
                                <span className="date">{new Date(review.postedAt).toLocaleDateString()}</span>
                            </Link>

                        </li>
                    ))}
                    </ul>
                }
            </div>
        </div>
    )
}

export default OtherProfile