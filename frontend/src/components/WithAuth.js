"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUtils } from './utils/auth';
import LoadingSpinner from './LoadingSpinner';

const WithAuth = (WrappedComponent) => {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const [isValidating, setIsValidating] = useState(true);
        const [isAuthorized, setIsAuthorized] = useState(false);

        useEffect(() => {
            const validateAuth = async () => {
                if (!AuthUtils.isAuthenticated()) {
                    router.push('/form/login');
                    return;
                }

                try {
                    const axiosInstance = AuthUtils.createAuthenticatedAxios();
                    const response = await axiosInstance.get('/api/auth/validate-token');

                    if (response.data.success) {
                        setIsAuthorized(true);
                    } else {
                        AuthUtils.removeTokens();
                        router.push('/form/login');
                    }
                } catch (error) {
                    console.error('Token validation error:', error);
                    AuthUtils.removeTokens();
                    router.push('/form/login');
                } finally {
                    setIsValidating(false);
                }
            };

            validateAuth();
        }, [router]);

        if (isValidating) {
            return (
                <LoadingSpinner
                    type="wave"
                    text="Verifying your session.."
                />
            );
        }

        return isAuthorized ? <WrappedComponent {...props} /> : null;
    };
};

export default WithAuth;