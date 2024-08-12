import React, { useState } from 'react';
import { baseUrl } from '../../api/http-client';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { setTokenItem } from '../../redux/slices/tokenSlice';
import ReCAPTCHA from 'react-google-recaptcha';

import "./registration.css";

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [adminKey, setAdminKey] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const dispatch = useDispatch();

    console.log(recaptchaToken);

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
      };


    const handleSubmit = async (event) => {
        event.preventDefault();
        

        if (!recaptchaToken) {
            alert('Please complete the reCAPTCHA.');
            return;
          }

        try {
            const response = await baseUrl.post('/api/auth/register', new URLSearchParams({
                name: name,
                email: email,
                password: password,
                role: role,
                adminKey: adminKey,
                "g-recaptcha-response": recaptchaToken
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            console.log('Registration successful:', response.data);
            const accessToken = response?.data.access_token;
            const user = response?.data.user;
            const decode = jwtDecode(accessToken);
            const exp = decode.exp;
            console.log(exp);
            dispatch(setUser(user))
            dispatch(setTokenItem({
                access_token: accessToken,
                exp: exp
            }))
        } catch (error) {
            console.error('There was an error registering:', error);
        }
    };

    return (
        <div className="register-block">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                {role === 'ADMIN' && (
                    <div>
                        <label>Admin Key:</label>
                        <input type="text" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} required />
                    </div>
                )}
                <div className="mt-2">
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_SITE_KEY}
                        onChange={handleRecaptchaChange}
                        theme="light"
                    />

                </div>
               
                <button type="submit" disabled={!recaptchaToken}>Register</button>
            </form>

        </div>
        
    );
};

export default Registration;
