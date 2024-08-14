import React, { useState } from 'react';
import { baseUrl } from '../../api/http-client';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { removeUser, setUser } from '../../redux/slices/userSlice';
import { removeToken, setTokenItem } from '../../redux/slices/tokenSlice';
import { useNavigate } from 'react-router-dom';

import "./login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await baseUrl.post('/api/auth/login', {
                email,
                password,
            });

            console.log('Login successful:', response.data);
            if (response?.data.message === "success") {
                const accessToken = response?.data?.access_token;
                const user = response?.data.user;
                const decode = jwtDecode(accessToken);
                const exp = decode.exp;
                console.log(exp);
                dispatch(setUser(user))
                dispatch(setTokenItem({
                    access_token: accessToken,
                    exp
                }))
                navigate("/");
                
            } else {
                alert("Login is failed!")
            }
            
            // if (accessToken && typeof accessToken === 'string') {
            //     const decodedToken = jwtDecode(accessToken);
            //     console.log('Token Expiration:', decodedToken.exp);
            // } else {
            //     console.error('Access token is missing or invalid in the response');
            // }
        } catch (error) {
            console.error('There was an error logining:', error);
        }
    };

    const handleLogout = async() => {
        try {
            const response = await baseUrl.post('/api/auth/logout');
            console.log(response.data);
            dispatch(removeUser());
            dispatch(removeToken());

        } catch (error) {
            console.error('There was an error logouting:', error);
        }
    }

    return (
        <div className="login-block">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="mt-5">
                <button onClick={handleLogout} className="btn btn-sm" style={{ color: "white" }}>
                    Logout
                </button>
            </div>

        </div>
        
    );
};

export default Login;
