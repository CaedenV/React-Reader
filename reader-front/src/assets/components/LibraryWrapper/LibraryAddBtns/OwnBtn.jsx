import './addbtns.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { ownBack, userBack } from '../../../backendRoutes';
import apiClient from '../../../axiosTokenIntercept';

const OwnBtn = ({ bookId, isOwned }) => {
    const token = localStorage.getItem('accessToken');

    const purchaseBook = async () => {
        await apiClient.post(`${ownBack}/add`, {
            body: {bookId: bookId},
            headers: { Authorization: `Bearer ${token}` }
          });
        
        isOwned = true;
    };

    const setCurrentRead = async () => {
        await apiClient.put(`${userBack}/nowRead`, {
            body: {bookId: bookId},
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    return (
        <div className="button">
            {!isOwned ?
                (<button className="add buy" onClick={purchaseBook}><i className="fa-solid fa-cart-shopping"/></button>)
                :
                (<Link className="startRead" to={`/read/${bookId}`}>
                    <button className="add read" onClick={setCurrentRead}><i className="fa-solid fa-book-open-reader" /></button>
                </Link>)}
        </div>
    )
}

export default OwnBtn