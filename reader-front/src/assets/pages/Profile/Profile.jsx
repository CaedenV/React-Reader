import './profile.css';
import React from 'react';
import Popup from 'reactjs-popup';
import { useState, useEffect, useRef } from "react";
import { userBack, friendBack } from '../../backendRoutes';
import axios from "axios";

const Profile = ({ userId }) => {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [libNums, setLibNums] = useState({});
  const [editMode, setEditMode] = useState(false);
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
    }

    GetAllInfo();
    console.log("friends", friends);
    console.log("user", user);
  }, [userId]);

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

  const changeMode = () => {
    setEditMode(true);
  };

  const handleFileClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    var file = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result; // base64 encoded image data
      setUser({ ...user, userPicLink: imageData });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const info = {
      userName: formData.get('userName'),
      favGenre: formData.get('genre'),
      pic: formData.get('profPic'),
    }

    axios.patch(`${userBack}/update`, {
      body: { userInfo: info },
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  return (
    <form className="topCategory" onSubmit={handleSubmit}>
      <div className="settingsProfPic" onClick={handleFileClick}>
        <img className="topProfile"
          src={(user.userPicLink) || "https://static.vecteezy.com/system/resources/previews/000/348/518/original/vector-books-icon.jpg"} />
        <input type="file" accept="image/*" name='profPic' onChange={handleFileChange} ref={inputRef} style={{ display: "none" }} />
      </div>
      <div className="data">
        <div className="unFriends">
          {editMode ? <input type="text" value={user.userName} className='uName' /> :
            <label className='uName'>{user.userName}</label>
          }

          <Popup trigger={<button className="friends">Friends</button>} position="bottom center">
            <ul>
              {friends.map((friend) => (
                <li key={friend.friendId}>
                  {friend.friendId}
                  <button onClick={() => handleRemoveFriend(friend.friendId, user.userId)}>Remove</button>
                </li>
              ))}
            </ul>
            <Popup trigger={<button className="addF" >Add Friend</button>}
              modal nested>
              {<div className='modal'>
                <form className="enterName" onSubmit={handleAddFriend}>
                  <label className="enterLbl">Enter Username:</label>
                  <input type="text" className="fName" name='userName' placeholder="Friend UserName" />
                </form>
              </div>}
            </Popup>
          </Popup>
          {editMode ? <button type='submit' ><i className="settings fa-regular fa-square-check"></i></button> :
            <button onClick={changeMode}><i className="settings fa-solid fa-gears"></i></button>}
        </div>
        <div className="favGenre">
          <label className='title'>Favorite Genre:</label>
          {editMode ? <input name='genre'
            type="text" placeholder={user.userFavGenre || 'Tell us your favorite genre'} /> : <label>{user.userFavGenre || " This user hasn't set their favorite genre."}</label>}
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

export default Profile