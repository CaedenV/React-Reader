import React, { useEffect, useState } from 'react';
import './navbar.css';
import logo from '../../../assets/logo.png';
import Popup from 'reactjs-popup';
import Login from '../Login-Register/Login';
import Register from '../Login-Register/Register';
import { Link, useNavigate } from 'react-router-dom';
import NotifList from '../NotifDisplay/NotifList';
import axios from 'axios';
import { userBack } from '../../backendRoutes';

const NavBar = ({ userId, updateUserId }) => {
    const [loginPopOpen, setLoginPopOpen] = useState(false);
    const [registerPopOpen, setRegisterPopOpen] = useState(false);
    const [nowRead, setNowRead] = useState("");
    const token = localStorage.getItem('token');
    const nav = useNavigate();

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
    const handleLogOutClick = () => {
        const redirect = `/`;
        localStorage.clear();
        updateUserId(null);
        nav(redirect);
    }

    useEffect(() => {
        async function getNowRead() {
            await axios.get(`${userBack}/nowRead`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setNowRead(response.data.nowRead);
                });
        }
        if (userId) {
            getNowRead();
        }
    }, [userId]);


    return (
        <div>
            <nav className='container'>
                <Link to={''}><img src={logo} alt="WeReader" className='logo' /></Link>
                <ul>
                    <li><Link to={'/'}>HOME</Link></li>
                    <li><Link to={`store`}>STORE</Link></li>
                    <li><Link to={userId ? `/read/${nowRead}` : '/'}>READ</Link></li>
                    <li><Link to={userId ? `${userId}/library` : '/'}>LIBRARY</Link></li>
                </ul>
                <div className="profile">
                    <Popup trigger={<button><i className="fa-solid fa-circle-user"></i></button>} position="bottom center" className='userOptions'>
                        {userId ? (
                            <div className="userOptions">
                                <Link to={`/${userId}/profile`}>Profile</Link>
                                <a href="">Settings</a>
                                <a onClick={handleLogOutClick}>Logout</a>
                            </div>
                        ) : (
                            <div className="userOptions">
                                <button className='userBtn signUp' onClick={handleRegisterClick}>Sign Up</button>
                                <button className='userBtn logIn' onClick={handleLoginClick}>Log In</button>
                            </div>
                        )}

                    </Popup>
                    {userId ? (
                        <NotifList userId={userId}></NotifList>
                    ) : (
                        <></>
                    )}
                </div>
            </nav>
            {registerPopOpen && <Register onClose={() => setRegisterPopOpen(false)} onSign={handleSignRegClose} updateUserId={updateUserId} />}
            {loginPopOpen && <Login onClose={() => setLoginPopOpen(false)} updateUserId={updateUserId} />}
        </div>
    )
}

export default NavBar;