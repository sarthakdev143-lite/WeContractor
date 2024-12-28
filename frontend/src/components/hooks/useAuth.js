'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthUtils } from '../utils/auth';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const isValid = await AuthUtils.validateToken();
            setIsLoggedIn(isValid);
        } catch (error) {
            console.error("Error checking auth status: ", error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // On mount, check the authentication status
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setIsLoggedIn(true);
        }
        checkAuthStatus();

        const handleStorageChange = () => checkAuthStatus();
        window.addEventListener('storage', handleStorageChange);
        const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000); // Re-check every 5 minutes
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [checkAuthStatus]);

    const login = useCallback(async (authToken, refreshToken) => {
        AuthUtils.setTokens(authToken, refreshToken);
        localStorage.setItem('authToken', authToken); // Save token in localStorage
        setIsLoggedIn(true); // Optimistic update

        try {
            const isValid = await AuthUtils.validateToken();
            setIsLoggedIn(isValid);
        } catch (error) {
            console.error("Error checking auth status: ", error);
            setIsLoggedIn(false);
        }

        setTimeout(() => {
            // router.push('/user-dashboard');
            window.location.href = '/user-dashboard';
        }, 2000);
    }, []);

    const logout = useCallback(async () => {
        try {
            await AuthUtils.logout();
            setIsLoggedIn(false);
            localStorage.removeItem('authToken'); // Clear token from localStorage
            // router.push('/form/login');
            window.location.href = '/form/login';
        } catch (error) {
            console.error("Error during logout: ", error);
        }
    }, []);

    return { isLoggedIn, isLoading, login, logout };
};
