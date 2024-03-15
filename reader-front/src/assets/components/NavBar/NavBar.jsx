import React, { useEffect, useState } from 'react';
import './navbar.css';
import logo from '../../../assets/logo.png';
import Popup from 'reactjs-popup';
import Login from '../Login-Register/Login';
import Register from '../Login-Register/Register';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NavBar = ({ userId, setUserId }) => {
    const [loginPopOpen, setLoginPopOpen] = useState(false);
    const [registerPopOpen, setRegisterPopOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const handleLoginClick = () => {
        setLoginPopOpen(true);
    };
    const handleRegisterClick = () => {
        setRegisterPopOpen(true);
    };
    const handleSignRegClose = () => {
        
        setRegisterPopOpen(false);
        setLoginPopOpen(true);
    }

    useEffect(() => {
        //setLocalId(userId);
    }, [userId]);

    return (
        <div>
            <nav className='container'>
                <Link to={''}><img src={logo} alt="WeReader" className='logo' /></Link>
                <ul>
                    <li><Link to={userId ? `${userId}/home`: '/'}>HOME</Link></li>
                    <li><Link to={`store`}>STORE</Link></li>
                    <li><Link to={userId ? `read`: '/'}>READ</Link></li>
                    <li><Link to={userId ? `${userId}/library`: '/'}>LIBRARY</Link></li>
                </ul>
                <div className="profile">
                    <Popup trigger={<button><i className="fa-solid fa-circle-user"></i></button>} position="bottom center" className='userOptions'>
                        {userId ? (
                            <div className="userOptions">
                                <Link to={`/${userId}/profile`}>Profile</Link>
                                <a href="">Settings</a>
                                <a href="">Logout</a>
                            </div>
                        ) : (
                            <div className="userOptions">
                                <button className='userBtn signUp' onClick={handleRegisterClick}>Sign Up</button>
                                <button className='userBtn logIn' onClick={handleLoginClick}>Log In</button>
                            </div>
                        )}

                    </Popup>
                    {userId ? (
                        <Popup trigger={<button><i className="fa-solid fa-bell"></i></button>} position="bottom center" className='userOptions'>
                            <div className="userNotifs">
                                <a href="/">Book 1</a>
                                <a href="">Book 2</a>
                                <a href="">Book 3</a>
                            </div>
                        </Popup>
                    ) : (
                        <></>
                    )}
                </div>
            </nav>
            {registerPopOpen && <Register onClose={() => setRegisterPopOpen(false)}  onSign={handleSignRegClose} setUser={setUserId}/>}
            {loginPopOpen && <Login onClose={() => setLoginPopOpen(false)} setUser={setUserId}/>}
        </div>
    )
}

export default NavBar