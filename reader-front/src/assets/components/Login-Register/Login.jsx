import { React, useState } from 'react'
import './login-register.css';
import Popup from 'reactjs-popup';
import { userBack } from '../../backendRoutes';
import apiClient from '../../axiosTokenIntercept';
import { jwtDecode } from 'jwt-decode';

const Login = ({ onClose, updateUserId }) => {
    const [valid, setValid] = useState('');

    const inputs = [
        { label: 'Email', type: 'email', name: 'email', placeholder: 'example@email.com' },
        { label: 'Password', type: 'password', name: 'pw', placeholder: 'Password', },
    ];

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('pw'),
        }
        const response = await apiClient.post(`${userBack}/login`, data);
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
                <div className='log alone'>
                    <h1 className="header">Please log in:</h1>
                    <form action="submit" className='info' onSubmit={submitForm}>
                        {inputs.map((input, index) => (
                            <div key={index} className="inputContainer">
                                <label className='inputLabel'>{input.label}</label>
                                <input type={input.type} name={input.name} className={`input`} placeholder={input.placeholder} onChange={input.onChange} />
                            </div>
                        ))}
                        <label className="response">{valid}</label>
                        <button type='submit' className='sign'>Login</button>
                    </form>
                </div>
            )}
        </Popup>
    )
}

export default Login