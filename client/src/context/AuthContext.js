import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios'; // Import our configured axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for stored user on load
    useEffect(() => {
        const storedUser = localStorage.getItem('client_user');
        const token = localStorage.getItem('client_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        // data contains { token, user }
        localStorage.setItem('client_token', data.token);
        localStorage.setItem('client_user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('client_user');
        localStorage.removeItem('client_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
