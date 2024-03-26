import './addbtns.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ownBack, userBack } from '../../../backendRoutes';

const OwnBtn = ({ bookId, isOwned }) => {
    const token = localStorage.getItem('token');

    const purchaseBook = async () => {
        await axios.post(`${ownBack}/add`, {
            body: {bookId: bookId},
            headers: { Authorization: `Bearer ${token}` }
          });
        
        isOwned = true;
    };

    const setCurrentRead = async () => {
        await axios.put(`${userBack}/nowRead`, {
            body: {bookId: bookId},
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    return (
        <div className="button">
            {!isOwned ?
                (<button className="add buy" onClick={purchaseBook}> Buy </button>)
                :
                (<Link className="startRead" to={`/read/${bookId}`}>
                    <button className="read" onClick={setCurrentRead}> Read </button>
                </Link>)}
        </div>
    )
}

export default OwnBtn