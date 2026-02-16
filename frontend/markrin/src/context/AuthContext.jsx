import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const [refreshToken, setRefreshToken] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for existing user on mount via API (Cookie Validation)
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Clean up legacy localStorage if exists
                localStorage.removeItem('userInfo');

                // Fetch profile to validate cookie
                const data = await authAPI.getProfile();
                setUser(data);
            } catch (err) {
                // Not logged in or session expired
                setUser(null);
                setRefreshToken(null);
            } finally {
                setLoading(false);
            }
        };
        checkSession();

        // Listen for 401 events from api/index.js
        const handleUnauthorized = async () => {
            if (user && refreshToken) { // Only try to refresh if we have refresh token
                try {
                    const response = await authAPI.refreshToken(refreshToken);
                    setRefreshToken(response.refreshToken);
                    // Re-fetch user profile with new access token
                    const userData = await authAPI.getProfile();
                    setUser(userData);
                    toast.success('Session refreshed');
                    return; // Exit if refresh succeeded
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            }
            
            // If no refresh token or refresh failed
            toast.error('Session expired, please login again');
            setUser(null);
            setRefreshToken(null);
            navigate('/login');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [navigate]);

    // Register user
    const register = async (name, email, password) => {
        try {
            const data = await authAPI.register({ name, email, password });
            setUser(data);
            setRefreshToken(data.refreshToken);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const data = await authAPI.login({ email, password });
            setUser(data);
            setRefreshToken(data.refreshToken);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            // Call backend to clear cookie and invalidate refresh token
            await fetch('http://localhost:9000/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ refreshToken })
            });
        } catch (e) {
            console.error("Logout failed", e);
        }
        setUser(null);
        setRefreshToken(null);
        navigate('/login');
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
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Direct user state update
    const updateUser = (userData) => {
        setUser((prev) => ({ ...prev, ...userData }));
    };

    const value = {
        user,
        loading,
        refreshToken,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        register,
        login,
        logout,
        getProfile,
        updateProfile,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
