import React from 'react'
import './login-register.css';
import Popup from 'reactjs-popup';

const Login = ({ onClose }) => {
    return (
        <Popup open={true} onClose={onClose} modal nested>
            {close => (
                <div className='log'>
                    <h1 className="header">Sign In</h1>
                    <p className="description">Please enter the following information:</p>
                    <form action="submit" className='info'>
                        <input type="text" name="userName" className='userName' placeholder='Username' />
                        <input type="password" name="pw" className='password' placeholder='Password' />
                        <button type='submit' className='sign' onClick={close}>Sign In</button>
                    </form>
                </div>
            )}
        </Popup>
    )
}

export default Login