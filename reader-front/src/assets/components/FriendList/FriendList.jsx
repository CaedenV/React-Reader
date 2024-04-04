import React, { useState, useEffect } from 'react';
import { notifBack, friendBack, backend } from '../../backendRoutes';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FriendList = ({ userFriends, otherFriends, userId }) => {
  const [commonFriends, setCommonFriends] = useState([]);
  const [uniqueFriends, setUniqueFriends] = useState([]);
  const [friends, setFriends] = useState(userFriends);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (otherFriends) {
      otherFriends = otherFriends.filter(friend => friend.id !== userId);
      // Identify common friends
      const common = userFriends.filter(userFriend =>
        otherFriends.some(otherFriend => otherFriend.id === userFriend.id)
      );

      // Identify unique friends in otherFriends list
      const unique = otherFriends.filter(otherFriend =>
        !common.some(commonFriend => commonFriend.userId === otherFriend.userId)
      );

      setCommonFriends(common);
      setUniqueFriends(unique);
    }
    else {
      setCommonFriends(userFriends);
    }
  }, [friends, otherFriends]);

  const addOrRemoveFriend = async (friend, operation) => {
    try {
      if (operation === 'add') {
        await axios.post(`${notifBack}/sendFriend/`, { friendName: friend.userName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.delete(`${friendBack}/delete`, {
          body: { friend: friend },
          headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
          setFriends(response.data.friends);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='friendsList'>
      {commonFriends ? commonFriends.map((friend, i) => (
        <div className="fItem" key={i}>
          <p className='namePic'>
            <Link to={`/profile/${friend.userName}`} > <img src={`${backend}${friend.pic}`} className='miniF' /> </Link>
            <Link to={`/profile/${friend.userName}`} > {friend.userName} </Link>
          </p>
          <button onClick={() => addOrRemoveFriend(friend, 'remove')}>-</button>
        </div>
      )) : <></>}
      {uniqueFriends ? uniqueFriends.map((friend, i) => (
        <div className="fItem" key={i}>
          <p className='namePic'>
            <Link to={`/profile/${friend.userName}`} > <img src={`${backend}${friend.pic}`} className='miniF' /> </Link>
            <Link to={`/profile/${friend.userName}`} > {friend.userName} </Link>
          </p>
          <button onClick={() => addOrRemoveFriend(friend, 'add')}>+</button>
        </div>
      )) : <></>}
    </div>
  );
}

export default FriendList