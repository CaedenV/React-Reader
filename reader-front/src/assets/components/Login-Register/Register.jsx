import React from 'react'
import './login-register.css';
import Popup from 'reactjs-popup';
const Register = ({ onClose, onSign }) => {
    return (
        <Popup open={true} onClose={onClose} modal nested>
            {close => (
                <div className="overall">
                    <div className="page">
                        <div className="log">
                            <h1 className="header">Welcome Back!</h1>
                            <p className="description">Please click 'Sign In' to continue.</p>
                            <button className="sign" onClick={onSign}>Sign In</button>
                        </div>
                        <div className="create">
                            <h1 className="header">Create Account</h1>
                            <p className="description">Don't have an account? No problem! It'll only take a few seconds. If you do have an account, please log in.</p>
                            <form action="submit" className="info">
                                <input type="text" name="userName" className='userName' placeholder='Username' />
                                <input type="email" name="email" className='email' placeholder='Email Address' />
                                <input type="password" name="pw" className='password' placeholder='Password' />
                                <input type="password" name="rePW" className="rePW" placeholder='Re-Enter Password' />
                                <button type="submit" className='submit'>Create Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default Register