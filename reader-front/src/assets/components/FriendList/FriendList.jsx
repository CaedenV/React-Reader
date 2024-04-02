import React, { useState, useEffect } from 'react';
import { friendBack } from '../../backendRoutes';
import axios from 'axios';

const FriendList = ({userFriends, otherFriends}) => {
    const [commonFriends, setCommonFriends] = useState([]);
    const [uniqueFriends, setUniqueFriends] = useState({ user: [], other: [] });
    const [friends, setFriends] = useState(userFriends);
    const token = localStorage.getItem('token');
  
    useEffect(() => {
      // Compare the two friend lists
      const userFriendsSet = new Set(friends);
      const otherFriendsSet = new Set(otherFriends);
      const commonFriends = Array.from(userFriendsSet.intersection(otherFriendsSet));
      const uniqueFriends = { user: [], other: [] };
  
      for (const friend of userFriendsSet) {
        if (!commonFriends.includes(friend)) {
          uniqueFriends.user.push(friend);
        }
      }
  
      for (const friend of otherFriendsSet) {
        if (!commonFriends.includes(friend)) {
          uniqueFriends.other.push(friend);
        }
      }
  
      setCommonFriends(commonFriends);
      setUniqueFriends(uniqueFriends);
    }, [friends, otherFriends]);

    const addOrRemoveFriend = async (friend, operation) => {
        try {
          if (operation === 'add') {
            await axios.post(`${friendBack}/add`, {
                body: { friend: friend },
                headers: { Authorization: `Bearer ${token}` }
              })
                .then((response) => {
                  setFriends(response.data.friends);
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
      <div>
        {commonFriends.map(friend => (
          <div key={friend}>
            <span>{friend} <button onClick={() => addOrRemoveFriend(friend, 'remove')}>-</button></span>
          </div>
        ))}
        {uniqueFriends.other.map(friend => (
          <div key={friend}>
            <span>{friend}<button onClick={() => addOrRemoveFriend(friend, 'add')}>+</button></span>
          </div>
        ))}
      </div>
    );
}

export default FriendList