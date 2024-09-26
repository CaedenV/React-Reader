import React, { useState } from 'react'
import './login-register.css';
import Popup from 'reactjs-popup';
import apiClient from '../../axiosTokenIntercept';
import { userBack } from '../../backendRoutes';
import { jwtDecode } from "jwt-decode";
import profPic from '../../profPic.png';

const Register = ({ onClose, onSign, updateUserId }) => {
    const [typedPass, setTypedPass] = useState('');
    const [valid, setValid] = useState('');

    const inputs = [
        { label: 'UserName', type: 'text', name: 'userName', placeholder: 'Username' },
        { label: 'Email', type: 'email', name: 'email', placeholder: 'example@email.com' },
        { label: 'Password', type: 'password', name: 'pw', placeholder: 'Password', onChange: (e) => setTypedPass(e.target.value) },
        { label: 'Confirm Password', type: 'password', name: 'rePW', placeholder: 'Password', onChange: (e) => compPass(e.target.value) },
      ];

    const compPass = (reTyped) => {
        if (reTyped === typedPass) { setValid("");}
        else {
            setValid("The passwords do NOT match.");
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            userName: formData.get('userName'),
            email: formData.get('email'),
            password: formData.get('pw'),
            pic: profPic,
        }

        const response = await apiClient.post(`${userBack}/register`, data);
        setValid(response.data.message);
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.token.accessT);
            localStorage.setItem('refreshToken', response.data.token.refreshT);
            updateUserId(jwtDecode(response.data.token.accessT).id);
            onClose;
        }
    }

    return (
        <Popup open={true} onClose={onClose} modal nested>
            {close => (
                <div className="page alone">
                    <div className="log">
                        <h1 className="header">Already have an account?<br></br>Log in here:</h1>
                        <button className="sign" onClick={onSign}>Login</button>
                    </div>
                    <div className="create">
                        <h1 className="header">Create Account</h1>
                        <form action="submit" className="info" onSubmit={submitForm}>
                            {inputs.map((input, index) => (
                                <div key={index} className="inputContainer">
                                    <label className='inputLabel'>{input.label}</label>
                                    <input type={input.type} name={input.name} className={`input`} placeholder={input.placeholder} onChange={input.onChange}/>
                                </div>
                            ))}
                            <label className="response">{valid}</label>
                            <button type="submit" className='submit'>Sign Up</button>
                        </form>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default Register