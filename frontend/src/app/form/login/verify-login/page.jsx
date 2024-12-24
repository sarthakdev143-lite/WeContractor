// src/app/form/login/verify-login/page.js
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MYAXIOS } from '@/components/Helper';
import { AuthUtils } from '@/components/utils/auth';
import { notify } from '@/components/notifications';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '@/components/LoadingSpinner';

// Main verification component
const VerifyLoginContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [verificationStatus, setVerificationStatus] = useState('verifying');
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setVerificationStatus('error');
                notify.error('Invalid verification link');
                return;
            }

            try {
                const response = await MYAXIOS.get(`/api/auth/verify-login?token=${token}`);

                if (response.data.success) {
                    AuthUtils.setTokens(response.data.token, response.data.refreshToken);
                    setVerificationStatus('success');
                    notify.success('Login successful!');

                    setTimeout(() => {
                        window.location.href = '/user-dashboard';
                    }, 1500);
                } else {
                    setVerificationStatus('error');
                    notify.error(response.data.message || 'Verification failed');
                }
            } catch (error) {
                console.error('Verification Error:', error);
                setVerificationStatus('error');

                if (error.response?.data?.message) {
                    notify.error(error.response.data.message);
                } else {
                    notify.error('An error occurred during verification');
                }
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6 text-center">
                {verificationStatus === 'verifying' && (
                    <>
                        <div className="mb-4 animate-spin text-blue-500">
                            <i className="ri-loader-4-line text-5xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Verifying your login...</h2>
                        <p className="mt-2 text-gray-500">Please wait while we verify your login attempt.</p>
                        <span className='mt-2 text-red-600'>Do not Refresh the Page.</span>
                    </>
                )}

                {verificationStatus === 'success' && (
                    <>
                        <div className="mb-4 text-green-500 animate-bounce">
                            <i className="ri-check-line text-5xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600">Login Verified!</h2>
                        <p className="mt-2 text-gray-500">Redirecting you to your dashboard...</p>
                    </>
                )}

                {verificationStatus === 'error' && (
                    <>
                        <div className="mb-4 text-red-500 animate-pulse">
                            <i className="ri-error-warning-line text-5xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
                        <p className="mt-2 text-gray-500">Please try logging in again.</p>
                        <button
                            onClick={() => router.push('/form/login')}
                            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-200"
                        >
                            Return to Login
                        </button>
                    </>
                )}
            </div>
            <ToastContainer
                position="top-center"
                newestOnTop
                closeOnClick
                draggable
                theme="light"
                className="mt-6"
            />
        </div>
    );
};

// Wrapper component with Suspense
const VerifyLogin = () => {
    return (
        <Suspense fallback={<LoadingSpinner
            type="bounce"
        />}>
            <VerifyLoginContent />
        </Suspense>
    );
};

export default VerifyLogin;