import React from 'react';
import { Link } from 'react-router-dom';
import { backend, notifBack, friendBack } from '../../backendRoutes';
import axios from 'axios';
import useUser from '../../hooks/useUser';

const FriendItem = ({ friend, relationship, pending, onPendingChange }) => {
    const token = localStorage.getItem('token');
    const userId = useUser();

    const addOrRemoveFriend = async (friend, operation) => {
        try {
            if (operation === '+') {
                await axios.post(`${notifBack}/sendFriend/`, { friendName: friend.userName }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onPendingChange(friend, true);
            } else {
                const id = friend.friendUsersId;
                await axios.delete(`${friendBack}/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fItem" >
            <p className='namePic'>
                <Link to={userId != friend.id ? `/profile/${friend.userName}` : `/${userId}/profile`} > <img src={`${backend}${friend.pic}`} className='miniF' /> </Link>
                <Link to={userId != friend.id ? `/profile/${friend.userName}` : `/${userId}/profile`} style={{fontWeight: 'bold'}}> {friend.userName} </Link>
            </p>
            {userId != friend.id ? !pending ? <button onClick={() => addOrRemoveFriend(friend, relationship)}>{relationship}</button> :
                <label style={{ fontSize: '15px', color: 'purple', fontWeight: 'bold' }} className='requested'>
                    Sent
                </label> : <></>
            }

        </div>
    )
}

export default FriendItem