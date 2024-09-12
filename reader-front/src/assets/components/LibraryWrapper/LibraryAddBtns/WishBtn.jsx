import './addbtns.css';
import React, { useState } from 'react';
import { wishBack } from '../../../backendRoutes';
import axios from 'axios';

const WishBtn = ({ bookId, isWished }) => {
  const token = localStorage.getItem('token');
  const [wished, setWished] = useState(isWished);

  const addToWish = async () => {
    await axios.post(`${wishBack}/add`, {bookId: bookId}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWished(true);
  }
  const rmvFromWish = async () => {
    await axios.delete(`${wishBack}/remove/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWished(false);
  }
  return (
    <button className="add wish" >
      {wished ? <i className="singleIcon fa-solid fa-bookmark" onClick={rmvFromWish} /> : <i className="wishIcon fa-regular fa-bookmark" onClick={addToWish} />}
    </button>
  )
}

export default WishBtn