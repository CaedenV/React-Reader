import './profile.css';
import React from 'react';
import Popup from 'reactjs-popup';
import { useState, useEffect, useRef } from "react";
import { userBack, friendBack } from '../../backendRoutes';
import profPic from '../../profPic.png';
import axios from "axios";
import { Link } from 'react-router-dom';

const Profile = ({ userId }) => {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [libNums, setLibNums] = useState({});
  const [editResponse, setEditResponse] = useState("");
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function GetAllInfo() {
      await axios.get(`${friendBack}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setFriends(response.data.friends);
        });

      await axios.get(`${userBack}/getMe`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => { setUser(response.data.user); });

      await axios.get(`${userBack}/selfLibCount`, {
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
      console.log(user);
    }

    GetAllInfo();
  }, [userId]);

  const handleFriendsBtn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    const friendName = e.target.value;
    axios.post(`${friendBack}/add`, {
      body: { friend: friendName },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setFriends(response.data.friends);
      });
  };

  const handleRemoveFriend = (friend) => {
    axios.delete(`${friendBack}/delete`, {
      body: { friend: friend },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setFriends(response.data.friends);
      });
  };


  const handleFileClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result; // base64 encoded image data
      setUser({ ...user, pic: imageData });
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (file) {
      formData.set('image', file);
    }
    formData.set('userName', formData.get('userName') || user.userName);
    formData.set('favGenre', formData.get('favGenre') || user.favGenre);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    await axios.patch(`${userBack}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setEditResponse(response.data.message);
    });
  };

  return (
    <div className="topCategory">
      <div className="settingsProfPic">
        <img className="topProfile"
          src={ `${user.pic}` || profPic} />
      </div>
      <div className="data">
        <div className="unFriends">
          <label className='uName'>{user.userName}</label>
          <Popup trigger={<button className="friends" onClick={handleFriendsBtn}>Friends</button>} position="bottom center">
            <ul className='friendsList'>
              {friends.map((friend) => (
                <li key={friend.friendId}>
                  {friend.friendId}
                  <button onClick={() => handleRemoveFriend(friend.friendId, user.userId)}>Remove</button>
                </li>
              ))}
            </ul>
            <Popup trigger={<button className="addF" >Add Friend</button>}
              position="bottom center">
              {<div className='modal'>
                <form className="enterName" onSubmit={handleAddFriend}>
                  <label className="enterLbl">Enter Username:</label>
                  <input type="text" className="fName" name='userName' placeholder="Friend UserName" />
                </form>
              </div>}
            </Popup>
          </Popup>

          <Popup trigger={<button><i className="settings fa-solid fa-gears" /></button>} modal nested>
            <form className='edit' onSubmit={handleSubmit} encType="multipart/form-data" >
              <div className="smallPic" onClick={handleFileClick}>
                <img src={(user.pic) || profPic} />
                <input type="file" accept="image/*" name="image" onChange={handleFileChange} ref={inputRef} style={{ display: "none" }} />
              </div>
              <div className="changeText">
                <input type="text" className='top' name="userName" placeholder={user.userName || "UserName"} />
                <input type="text" name="favGenre" placeholder={user.favGenre || "Favorite Genre"} />
                <label>{editResponse}</label>
                <button type='submit'>Save</button>
              </div>
            </form>
          </Popup>

        </div>
        <div className="favGenre">
          <label className='title'>Favorite Genre:</label>
          <label>{user.favGenre || " This user hasn't set their favorite genre."}</label>
        </div>
        <Link to={`/${userId}/library`}>
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
        </Link>

      </div>
    </div>

  )
}

export default Profile