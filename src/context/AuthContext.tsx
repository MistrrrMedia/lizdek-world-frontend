import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser, LoginCredentials } from '../types/auth';
import api from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on app load
        const token = sessionStorage.getItem('auth_token');
        if (token) {
            // Verify token with backend
            api.get('/auth/verify')
                .then(response => {
                    setUser(response.data.user);
                })
                .catch(() => {
                    sessionStorage.removeItem('auth_token');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            
            sessionStorage.setItem('auth_token', token);
            setUser(user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        sessionStorage.removeItem('auth_token');
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 