"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUtils } from '../utils/auth';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = useCallback(() => {
        setIsLoggedIn(AuthUtils.isAuthenticated());
        setIsLoading(false);
    }, []);

    const login = useCallback(async (token) => {
        AuthUtils.setToken(token);
        setIsLoggedIn(true);
        router.push('/dashboard');
    }, [router]);

    const logout = useCallback(() => {
        AuthUtils.removeToken();
        setIsLoggedIn(false);
        router.push('/form/login');
    }, [router]);

    return {
        isLoggedIn,
        isLoading,
        login,
        logout,
        checkAuthStatus
    };
};