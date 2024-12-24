// useAuth.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUtils } from '../utils/auth';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuthStatus = useCallback(async () => {
        try {
            const isValid = await AuthUtils.validateToken();
            setIsLoggedIn(isValid);
        } catch (error) {
            console.error("Error checking auth status :- "+error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
        // Set up periodic token validation
        const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(intervalId);
    }, [checkAuthStatus]);

    const login = useCallback(async (accessToken, refreshToken) => {
        AuthUtils.setTokens(accessToken, refreshToken);
        setIsLoggedIn(true);
        router.push('/user-dashboard');
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await AuthUtils.logout();
            setIsLoggedIn(false);
            router.push('/form/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear tokens and redirect on error
            AuthUtils.removeTokens();
            setIsLoggedIn(false);
            router.push('/form/login');
        }
    }, [router]);

    return {
        isLoggedIn,
        isLoading,
        login,
        logout,
        checkAuthStatus
    };
};