import React from 'react'
import './navbar.css'
import logo from '../../../assets/logo.png'
import Popup from 'reactjs-popup'

const NavBar = (userId) => {
    return (
        <nav className='container'>
            <img src={logo} alt="WeReader" className='logo' />
            <ul>
                <li><a href="">HOME</a></li>
                <li><a href="">STORE</a></li>
                <li><a href="">READ</a></li>
                <li><a href="">LIBRARY</a></li>
            </ul>
            <div className="profile">
                <Popup trigger={<button><i class="fa-solid fa-circle-user"></i></button>} position="bottom center" className='userOptions'>
                    <div className="userOptions">
                        {userId ? <a href="">Profile</a>: <a href="/">Log In</a>}
                        <a href="">Settings</a>
                        {userId ? <a href="">Logout</a>:<></>}
                    </div>
                </Popup>
                <Popup trigger={<button><i class="fa-solid fa-bell"></i></button>} position="bottom center" className='userOptions'>
                    <div className="userNotifs">
                        <a href="/">Book 1</a>
                        <a href="">Book 2</a>
                        <a href="">Book 3</a>
                    </div>
                </Popup>
            </div>

        </nav>
    )
}

export default NavBar