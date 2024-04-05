import React, { useState, useEffect } from 'react';
import FriendItem from './FriendItem';

const FriendList = ({ userFriends, otherFriends, pendingFriends, onPendingChange }) => {
  const [commonFriends, setCommonFriends] = useState([]);
  const [uniqueFriends, setUniqueFriends] = useState([]);

  useEffect(() => {
    if (otherFriends) {
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
  }, [userFriends, otherFriends, pendingFriends]);


  return (
    <div className='friendsList'>
      {commonFriends? commonFriends.map((friend) => (
        <FriendItem friend={friend} relationship={"-"} key={friend.id}/>
      )) : <></>}
      {uniqueFriends? uniqueFriends.map((friend) => (
        <FriendItem friend={friend} relationship={"+"} key={friend.id} pending={pendingFriends.find(f => f.id === friend.id)?.pending} onPendingChange={onPendingChange} />
      )) : <></>}
    </div>
  );
}

export default FriendList