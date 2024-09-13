import './profile.css';
import React from 'react';
import Popup from 'reactjs-popup';
import { useState, useEffect, useRef } from "react";
import { userBack, friendBack, notifBack, revBack } from '../../backendRoutes';
import { bisacGenres } from '../../bisacGenres';
import profPic from '../../profPic.png';
import axios from "axios";
import { Link } from 'react-router-dom';
import SmallBook from '../../components/BookDisplay/SmallBook/SmallBook';
import FriendList from '../../components/FriendList/FriendList';

const Profile = ({ userId }) => {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [fNum, setFNum] = useState(0);
  const [libNums, setLibNums] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [userRevs, setUserRevs] = useState({});
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem('token');


  //Retrieve info from the userFriends table 
  async function getFriends() {
    await axios.get(`${friendBack}/getUser`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => { setFriends(response.data.friends); });

    await axios.get(`${friendBack}/getNum`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => { setFNum(response.data.num); });
  }

  useEffect(() => {
    // Retrieve info from the users table
    async function GetPersonalInfo() {
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
    GetPersonalInfo();
    //console.log(isUpdated);
    getFriends();

    setInterval(getFriends, 60000);
  }, [userId, isUpdated]);

  useEffect(() => {
    async function getRevs() {
      try {
        const response = await axios.get(`${revBack}/user/${user.userName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserRevs(response.data.userRevs);
      } catch (error) {
        console.log(error);
      }
    }
    getRevs();
    //console.log(userRevs);
  }, [user]);

  // Sends the request to the receiver's notification box (posts request in notifs table)
  const handleAddFriend = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const friendName = fd.get('friendName');
    await axios.post(`${notifBack}/sendFriend/`, { friendName: friendName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  //updates the mini image in the 'update user' box
  const handleFileClick = () => {
    inputRef.current.click();
  };

  //updates the user useState with the proper image file
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result; // base64 encoded image data
      setUser({ ...user, pic: imageData });
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  //Submits all data, updated and not.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (file) {
      formData.set('image', file);
    }
    formData.set('userName', formData.get('userName') || user.userName);
    formData.set('favGenre', formData.get('favGenre') || user.favGenre);

    await axios.patch(`${userBack}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    setIsUpdated(!isUpdated);

  };

  return (
    <div className="profilePage">
      <div className="topCategory">
        <div className="settingsProfPic">
          <img className="topProfile"
            src={`${user.pic}` || profPic} />
        </div>
        <div className="data">
          <div className="unFriends">
            <label className='uName'>{user.userName}</label>
            <Popup trigger={<button className="friends"> {fNum} Friends</button>} position="bottom center">
              <div className="listPop">
                <div className='addPop'>
                  <form className="enterName" onSubmit={handleAddFriend}>
                    <label className="enterLbl">Add a Friend: </label>
                    <input type="text" className="fName" name='friendName' placeholder="UserName" />
                    <button className="addF" type='submit'>+</button>
                  </form>
                </div>

                {friends ? friends.length > 0 ?
                  <FriendList userFriends={friends} otherFriends={friends} /> : <label>Currently 0 friends</label>
                  : <></>}
              </div>


            </Popup>

            <Popup trigger={<button><i className="settings fa-solid fa-gears" /></button>} modal nested>
              <form className='edit' onSubmit={handleSubmit} encType="multipart/form-data" >
                <div className="smallPic" onClick={handleFileClick}>
                  <img src={(user.pic) || profPic} />
                  <input type="file" accept="image/*" name="image" onChange={handleFileChange} ref={inputRef} style={{ display: "none" }} />
                </div>
                <div className="changeText">
                  <input type="text" className='top' name="userName" placeholder={user.userName || "UserName"} />
                  <select className='type' id='type' value={user.favGenre} >
                    {/* {bisacGenres.map((genre, i) => {
                    return (<option value={genre} key={i}> {genre}</option>);
                  })} */}

                  </select>
                  <input type="text" name="favGenre" placeholder={user.favGenre || "Favorite Genre"} />
                  <button type='submit'>Save</button>
                </div>
              </form>
            </Popup>

          </div>
          <div className="favGenre">
            <label className='title'>Favorite Genre:</label>
            <label>{user.favGenre || " This user hasn't set their favorite genre."}</label>
          </div>

          <div className="bottom">
            {user.nowRead ?
              <div className="nowRead">
                <label className='cat'>Currently Reading:</label>
                <SmallBook bookId={user.nowRead} />
              </div> : <></>}
            <div className="libNums">

              <Link className='libNums' to={`/${userId}/library`}>
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
              </Link>
            </div>
          </div>

        </div>
      </div >
      <div className="userRevs">
        <h1 className="revListTitle">
          {user.userName}'s Reviews
        </h1>

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

export default Profile