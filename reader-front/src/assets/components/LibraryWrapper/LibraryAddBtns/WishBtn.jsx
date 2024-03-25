import './addbtns.css';
import React from 'react';
import { wishBack } from '../../../backendRoutes';

const WishBtn = ({ bookId, isWished }) => {
  const addToWish = async () => {
    axios.post(`${wishBack}/add`, {
      bookId: bookId
    });
    isWished = true;
  }
  const rmvFromWish = async () => {
    axios.delete(`${wishBack}/delete`, {
      bookId: bookId,
    });
    isWished = false;
  }
  return (
    <button className="add wish" >
      {isWished ? <i className="singleIcon fa-solid fa-list" onClick={rmvFromWish} ></i> : <i className="wishIcon fa-solid fa-list-check" onClick={addToWish}></i>}
    </button>
  )
}

export default WishBtn