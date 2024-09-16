import './share.css';
import React, { useState } from 'react';
import apiClient from '../../axiosTokenIntercept';
import { notifBack, backend } from '../../backendRoutes';

const ShareFriend = ({ friend, book }) => {
    const [response, setResponse] = useState("");
    const token = localStorage.getItem('accessToken');
    const shareBook = async () => {
        const data = {
            friend: friend.id,
            book: book
        };
        const results = await apiClient.post(`${notifBack}/sendBook`, { data: data }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (results.data.success) {
            setResponse(results.data.message);
        }
    }

    return (
        <div className='sendTo'>
            <button className='friend' onClick={() => shareBook()}><img src={`${backend}${friend.pic}`} className='miniF' />{friend.userName}</button> 
            {response}
        </div>
    )
}

export default ShareFriend