import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { RegisterRequest } from '../services/authService';
import { SpinnerLoading } from '../layouts/Utils/SpinnerLoading';

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    async function submitForm(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const userData: RegisterRequest = {
                username: username,
                email: email,
                password: password
            };
            
            await authService.register(userData);
            setSuccessMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || error.message || 'Registration failed');
            setDisplayWarning(true);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <SpinnerLoading />;
    }

    return (
        <div className='container mt-5 mb-5 d-flex justify-content-center'>
            <div className='card col-md-6 shadow-sm'>
                <div className='card-body'>
                    <h5 className='card-title mb-4'>Register New Account</h5>
                    {successMessage && (
                        <div className='alert alert-success' role='alert'>
                            {successMessage}
                        </div>
                    )}
                    {displayWarning && (
                        <div className='alert alert-danger' role='alert'>
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={submitForm}>
                        <div className='mb-3'>
                            <label className='form-label'>Username</label>
                            <input 
                                type='text' 
                                className='form-control' 
                                value={username}
                                onChange={e => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Email</label>
                            <input 
                                type='email' 
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
                        <button type='submit' className='btn btn-success w-100 mb-3'>
                            Register
                        </button>
                        <div className='text-center'>
                            <a href='/login' className='text-decoration-none'>Already have account? Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

