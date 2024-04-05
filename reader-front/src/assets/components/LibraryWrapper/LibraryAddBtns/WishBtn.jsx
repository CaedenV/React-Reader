import './addbtns.css';
import React, { useState } from 'react';
import { wishBack } from '../../../backendRoutes';
import axios from 'axios';

const WishBtn = ({ bookId, isWished }) => {
  const token = localStorage.getItem('token');
  const [wished, setWished] = useState(isWished || false);

  const addToWish = async () => {
    await axios.post(`${wishBack}/add`, {bookId: bookId}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWished(true);
  }
  const rmvFromWish = async () => {
    await axios.delete(`${wishBack}/delete`, {
      body: {bookId: bookId},
      headers: { Authorization: `Bearer ${token}` }
    });
    setWished(false);
  }
  return (
    <button className="add wish" >
      {wished ? <i className="singleIcon fa-solid fa-list" onClick={rmvFromWish} ></i> : <i className="wishIcon fa-solid fa-list-check" onClick={addToWish}></i>}
    </button>
  )
}

export default WishBtn