import React from 'react';
import Popup from 'reactjs-popup';

const TokenWarning = ({ expiresAt, setExpiresAt }) => {
    
    const handleLogOutClick = () => {
        const redirect = `/`;
        localStorage.clear();
        sessionStorage.clear();
        updateUserId(null);
        nav(redirect);
    }

    const handleResetClick = () => {
        const token = localStorage.getItem('token');
        const reset = jwtDecode(token);
        localStorage.clear();
        localStorage.setItem('token', reset);
        setExpiresAt(Date.now() + 3 * 60 * 60 * 1000);
    }
    
    return (
        <Popup modal nested>
            <div className='log'>
                <h1 className="header">Still Going?</h1>
                <p className="description">Your session is about to expire at {expiresAt}. Would you like to keep going? </p>
                <div className="btns">
                    <button type='submit' className='sign' onClick={handleResetClick}>Yes</button>
                    <button type='submit' className='sign' onClick={handleLogOutClick}>No</button>
                </div>
            </div>
        </Popup>
    )
}

export default TokenWarning