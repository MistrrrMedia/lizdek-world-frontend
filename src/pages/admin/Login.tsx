import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminLogin.css';

const AdminLogin: React.FC = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            await login(credentials);
            // Success - navigate immediately without clearing error (let component unmount handle it)
            navigate('/admin');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'INVALID CREDENTIALS');
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-content">
                <div className="admin-login-form-container">
                    <h1 className="admin-login-title">ADMIN LOGIN</h1>
                    
                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="username">USERNAME</label>
                            <input
                                id="username"
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                className="admin-input"
                                autoComplete="off"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">PASSWORD</label>
                            <input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="admin-input"
                                autoComplete="off"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="admin-login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                        </button>
                        
                        {error && (
                            <div className="admin-error">
                                {error}
                            </div>
                        )}
                    </form>
                    
                    <div className="admin-login-footer">
                        <button 
                            onClick={() => navigate('/')}
                            className="back-to-home"
                        >
                            ← BACK TO HOME
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin; 