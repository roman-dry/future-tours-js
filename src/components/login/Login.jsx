import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { baseUrl } from '../../api/http-client';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { removeUser, setUser } from '../../redux/slices/userSlice';
import { removeToken, setTokenItem } from '../../redux/slices/tokenSlice';
import { useNavigate, Link } from 'react-router-dom';

import "./login.css";
import endpoints from '../../shared/router/endpoints';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger, clearErrors, reset, setError } = useForm({
        mode: "onBlur" // Validate on blur
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const watchAllFields = watch();

    useEffect(() => {
        handleAutoFill(); // Триггерить валідацію на початку
        setIsButtonDisabled(!areAllFieldsFilled()); // Оновлює стан кнопки після завантаження сторінки
    }, []);
    

        // Функція для перевірки, чи всі поля заповнені
    let areAllFieldsFilled = () => {
        // Перевіряємо, чи всі поля мають значення
        return Object.values(watchAllFields).every(value => value);
    };

    useEffect(() => {
        setIsButtonDisabled(!areAllFieldsFilled());
    }, [watchAllFields]);


    const handleAutoFill = () => {
        // Check if fields are autofilled
        const fields = ["name", "surname", "email", "phone", "password", "passwordConfirm"];
        fields.forEach(field => {
            if (watch(field)) {
                setValue(field, watch(field)); // Set value to trigger validation
                trigger(field); // Trigger validation
            }
        });
    };  

    const onHandleSubmit = async (data) => {
        console.log(data);

        try {
            const response = await baseUrl.post('/api/auth/login', new URLSearchParams({
                email: data.email,
                password: data.password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
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
                alert(response?.data.message)
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


    return (
        <div className="login-block">
            <Link to={`${endpoints.HOME}`} className="back-home" ><h4>BACK</h4></Link>
            <form className="mx-auto px-2 d-flex flex-column" onSubmit={handleSubmit(onHandleSubmit)}>                               
                <div className={`d-flex flex-column ${errors.email ? "mb-0" : ""}`}
                     style={{ marginBottom: "21px" }}>
                    <input id="input-email"
                        type="email"
                        name="email"
                        placeholder="Email address"
                        autoComplete="email"
                        {...register("email", {
                            required: "Email is required",
                            maxLength: { value: 256, message: "Email shouldn't be more than 256 characters" },
                            pattern: { value: /^(?!.*@.*@)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                , message: "Invalid email address" }
                        })}
                        className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                        style={{
                            color: "black",
                            backgroundColor: "g#faf8f7",
                            borderRadius: "8px",
                            borderColor: `${watch("email") ? (errors.email ? "red" : "green") : "#faf8f7"}`
                        }} 
                        required 
                    />
                    <label htmlFor="input-email" className="form-text mt-0" style={{ color: `${errors.email ? "red" : "transparent"}` }}>
                        {errors.email && errors.email.message}
                    </label>
                </div>
                <div className={`d-flex flex-column ${errors.password ? "mb-0" : ""}`}
                     style={{ marginBottom: "21px" }}>
                    <input id="input-password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password should be at least 6 characters" },
                            maxLength: { value: 20, message: "No more than 20 characters" }
                        })}
                        className={`form-control form-control-sm ${errors.password ? "is-invalid" : ""}`}
                        style={{
                            color: "black",
                            backgroundColor: "g#faf8f7",
                            borderRadius: "8px",
                            borderColor: `${watch("password") ? (errors.password ? "red" : "green") : "g#faf8f7"}`
                        }} 
                        required 
                    />
                    <label htmlFor="input-password" className="form-text mt-0" style={{ color: `${errors.password ? "red" : "transparent"}` }}>
                        {errors.password && errors.password.message}
                    </label>
                </div>          
                <button 
                    type="submit"
                    className="btn btn-sm mb-2"  
                    style={{ width: "315px", height: "32px", color: `${!areAllFieldsFilled() ? "g#faf8f7" : "green"}`, borderColor: "#92f7f6", borderRadius: "8px", backgroundColor: `${!areAllFieldsFilled() ? "" : "#92f7f6"}` }}                      
                    disabled={isButtonDisabled}>
                        Login
                </button>
                <div className="text-center">
                    <Link to={`/${endpoints.REGISTRATION}`} className="registr-login-link" style={{ textDecoration: "none", color: "#f7e434" }}>I don't have an account yet</Link>
                </div> 
            </form>
        </div>
        
    );
};

export default Login;
