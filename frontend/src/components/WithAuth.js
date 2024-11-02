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
                    await axiosInstance.get('/api/validate-token'); 
                    setIsAuthorized(true);
                } catch (error) {
                    if (error.redirect) {
                        router.push('/form/login');
                    }
                } finally {
                    setIsValidating(false);
                }
            };

            validateAuth();
        }, [router]);

        if (isValidating) {
            return <LoadingSpinner />;
        }

        return isAuthorized ? <WrappedComponent {...props} /> : null;
    };
};

export default WithAuth;