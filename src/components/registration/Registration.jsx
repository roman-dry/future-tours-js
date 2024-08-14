import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { baseUrl } from '../../api/http-client';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { setTokenItem } from '../../redux/slices/tokenSlice';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

import "./registration.css";
import endpoints from '../../shared/router/endpoints';


const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [adminKey, setAdminKey] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger, clearErrors, reset, setError } = useForm({
        mode: "onBlur" // Validate on blur
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const watchAllFields = watch();

    useEffect(() => {
        // Trigger validation on form load for autofilled fields
        handleAutoFill();
    }, []);
    

    // Функція для перевірки, чи всі поля заповнені
  let areAllFieldsFilled = () => {
    // Перевіряємо, чи всі поля мають значення
    return Object.values(watchAllFields).every(value => value);
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
        if (name === 'password' || name === 'passwordConfirm') {
            const password = value.password;
            const passwordConfirm = value.passwordConfirm;
            if (password && passwordConfirm) {
                if (password !== passwordConfirm) {
                    areAllFieldsFilled = false;
                    setError('passwordConfirm', { type: 'manual', message: 'Passwords should match' });
                } else {
                    areAllFieldsFilled = true;
                    clearErrors('passwordConfirm');
                }
            }
        }
    });

    return () => subscription.unsubscribe();
}, [watch, setError, clearErrors]);

    console.log(recaptchaToken);

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
      };

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
        //event.preventDefault();
        console.log(data);
        

        if (!recaptchaToken) {
            alert('Please complete the reCAPTCHA.');
            return;
          }

        try {
            const response = await baseUrl.post('/api/auth/register', new URLSearchParams({
                name: data.name,
                email: data.email,
                password: data.password,
                role: role,
                adminKey: adminKey,
                "g-recaptcha-response": recaptchaToken
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            console.log('Registration successful:', response.data);
            console.log(response?.data.message)
            if (response?.data.message === "success") {                
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
                navigate(endpoints.HOME);
            } else {
                alert("Registration is failed!")
            }
            
        } catch (error) {
            console.error('There was an error registering:', error);
        }
    };

    return (
        <div className="register-block">
            <form className="mx-auto px-2 d-flex flex-column" onSubmit={handleSubmit(onHandleSubmit)}>
                <div className={`d-flex flex-column ${errors.name ? "mb-0" : ""}`}
                     style={{ marginBottom: "21px" }}>
                    <input 
                        id="input-first-name"
                        type="text"
                        name="name"
                        placeholder="First name"           
                        autoComplete="given-name"
                        {...register("name", {
                            required: "First name is required",
                            minLength: { value: 2, message: "First name should be at least 2 characters"},
                            maxLength: { value: 30, message: "First name shouldn't be more than 30 characters" },
                            pattern: {
                                value: /^(?!.{31})[A-Z][a-z]{1,}(-[A-Z][a-z]{1,})*$/,
                                message: "Only the Latin alphabet is allowed and the first letter is capitalized"
                            }

                        })}
                        className={`w-100 form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                        style={{
                            color: "black",
                            backgroundColor: "#faf8f7",
                            borderRadius: "8px",
                            borderColor: `${watch("name") ? (errors.name ? "red" : "green") : "#faf8f7"}`
                        }}
                        required />
                    <label htmlFor="input-first-name" className="form-text mt-0" style={{ color: `${errors.name ? "red" : "transparent"}` }}>
                        {errors.name && errors.name.message}
                    </label>
                </div>
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
                <div className={`d-flex flex-column ${errors.passwordConfirm ? "mb-0" : ""}`}
                     style={{ marginBottom: "21px" }}>
                    <input
                        id="input-password-confirm"
                        type="password"
                        name="passwordConfirm"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        {...register("passwordConfirm", {
                            required: "Please confirm your password",
                            validate: {
                                matchesPreviousPassword: value => {
                                    const { password } = watch();
                                    return password === value || "Passwords should match";
                                }
                            }
                        })}
                        className={`form-control form-control-sm ${errors.passwordConfirm ? "is-invalid" : ""}`}
                        style={{
                            color: "black",
                            backgroundColor: "g#faf8f7",
                            borderRadius: "8px",
                            borderColor: `${watch("passwordConfirm") ? (errors.passwordConfirm ? "red" : "green") : "g#faf8f7"}`
                        }}
                    />
                    <label htmlFor="input-password-confirm" className="form-text mt-0" style={{ color: `${errors.passwordConfirm ? "red" : "transparent"}` }}>
                        {errors.passwordConfirm && errors.passwordConfirm.message}
                    </label>
                </div>
                <div>
                    {/* <label>Role:</label> */}
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
                <div className="mt-2 m-auto">
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_SITE_KEY}
                        onChange={handleRecaptchaChange}
                        theme="light"
                    />

                </div>
                <div className="mb-4 mt-2 d-flex justify-content-center" >
                    <button 
                        className="btn btn-sm"  
                        style={{ width: "315px", height: "32px", color: `${!areAllFieldsFilled() || !recaptchaToken ? "g#faf8f7" : "green"}`, borderColor: "#92f7f6", borderRadius: "8px", backgroundColor: `${!areAllFieldsFilled() || !recaptchaToken ? "" : "#92f7f6"}` }}                      
                        type="submit" 
                        disabled={!areAllFieldsFilled() || !recaptchaToken}
                    >
                        REGISTER
                    </button>

                </div>
               
                
            </form>

        </div>
        
    );
};

export default Registration;
