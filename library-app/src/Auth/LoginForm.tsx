import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { authService, type LoginRequest } from '../services/authService';
import { SpinnerLoading } from '../layouts/Utils/SpinnerLoading';

export const LoginForm: React.FC = () => {
    const { login, isAuthenticated } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    if (isAuthenticated) {
        return <Navigate to='/home' replace />;
    }

    async function submitForm(event: any) {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const credentials: LoginRequest = {
                email: email,
                password: password
            };
            
            const response = await authService.login(credentials);
            login(response.accessToken, response.refreshToken);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setDisplayWarning(true);
            setErrorMessage(error.response?.data?.message || error.message || 'Login failed');
        }
    }

    if (loading) {
        return <SpinnerLoading />;
    }

    return (
        <div className='container mt-5 mb-5 d-flex justify-content-center'>
            <div className='card col-md-6 shadow-sm'>
                <div className='card-body'>
                    <form onSubmit={submitForm}>
                        <h5 className='card-title mb-4'>Login to library</h5>
                        {displayWarning && (
                            <div className='alert alert-danger' role='alert'>
                                {errorMessage}
                            </div>
                        )}
                        <div className='mb-3'>
                            <label className='form-label'>Login / Email</label>
                            <input 
                                type='text' 
                                className='form-control' 
                                value={email}
                                onChange={e => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Password</label>
                            <input 
                                type='password' 
                                className='form-control' 
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type='submit' className='btn btn-primary w-100'>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
