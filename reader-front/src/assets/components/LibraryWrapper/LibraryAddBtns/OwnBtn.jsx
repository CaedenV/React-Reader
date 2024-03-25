import './addbtns.css';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ownBack } from '../../../backendRoutes';

const OwnBtn = ({ bookId, isOwned }) => {
    const purchaseBook = async () => {
        await axios.post(`${ownBack}/add`, {
            bookId: bookId,
        });
        isOwned = true;
    };

    const setCurrentRead = async () => {
        await axios.put(`http://localhost:8000/user/${userId}/read`, {
            bookId: bookId
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