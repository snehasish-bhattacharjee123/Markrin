import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing user on mount
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
        }
        setLoading(false);
    }, []);

    // Register user
    const register = async (name, email, password) => {
        try {
            const data = await authAPI.register({ name, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const data = await authAPI.login({ email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    // Get user profile
    const getProfile = async () => {
        try {
            const data = await authAPI.getProfile();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            const data = await authAPI.updateProfile(userData);
            // Update local storage with new data
            const currentUser = JSON.parse(localStorage.getItem('userInfo'));
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        register,
        login,
        logout,
        getProfile,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
