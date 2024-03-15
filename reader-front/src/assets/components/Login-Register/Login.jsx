import {React, useState} from 'react'
import './login-register.css';
import Popup from 'reactjs-popup';
import { userBack } from '../../backendRoutes';
import axios from 'axios';

const Login = ({ onClose, setUser }) => {
    const [valid, setValid] = useState('');
    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('pw'),
        }
        const response = axios.post(`${userBack}/login` , data);
        console.log(response);
        // setValid(response[0].message);
        // if(response[0].success) {
        //     onClose;
        // }
    }

    return (
        <Popup open={true} onClose={onClose} modal nested>
            {close => (
                <div className='log'>
                    <h1 className="header">Sign In</h1>
                    <p className="description">Please enter the following information:</p>
                    <form action="submit" className='info' onSubmit={submitForm}>
                        <input type="email" name="email" className='input email' placeholder='Email' />
                        <input type="password" name="pw" className='input password' placeholder='Password' />
                        <label className="response">{valid}</label>
                        <button type='submit' className='sign'>Sign In</button>
                    </form>
                </div>
            )}
        </Popup>
    )
}

export default Login