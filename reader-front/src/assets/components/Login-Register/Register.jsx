import React, { useState } from 'react'
import './login-register.css';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { userBack } from '../../backendRoutes';

const Register = ({ onClose, onSign, setUser }) => {
    const [typedPass, setTypedPass] = useState('');
    const [valid, setValid] = useState('');

    const compPass = (reTyped) => {
        console.log(typedPass, reTyped);
        if (reTyped === typedPass) {
            setValid("");
        }
        else {
            setValid("The passwords do NOT match.");
        }
    }

    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            userName: formData.get('userName'),
            email: formData.get('email'),
            password: formData.get('pw'),
        }
        
        const response = axios.post(`${userBack}/register`, data);
        console.log(response);
        // setValid(response[0].message);
        // if(response[0].success) {
        //     onClose;
        // }
    }

    return (
        <Popup open={true} onClose={onClose} modal nested>
            {close => (
                <div className="page">
                    <div className="log">
                        <h1 className="header">Welcome Back!</h1>
                        <p className="description">Please click 'Sign In' to continue.</p>
                        <button className="sign" onClick={onSign}>Sign In</button>
                    </div>
                    <div className="create">
                        <h1 className="header">Create Account</h1>
                        <p className="description">Don't have an account? No problem! It'll only take a few seconds. If you do have an account, please log in.</p>
                        <form action="submit" className="info" onSubmit={submitForm}>
                            <input type="text" name="userName" className='input userName' placeholder='Username' />
                            <input type="email" name="email" className='input email' placeholder='Email Address' />
                            <input type="password" name="pw" className='input password' placeholder='Password' onChange={(e) => setTypedPass(e.target.value)}/>
                            <input type="password" name="rePW" className="input rePW" placeholder='Re-Enter Password' onChange={(e) => compPass(e.target.value)}/>
                            <label className="response">{valid}</label>
                            <button type="submit" className='submit'>Create Account</button>
                        </form>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default Register