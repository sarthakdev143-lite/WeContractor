"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MYAXIOS } from '../../../components/Helper';
import { AuthUtils } from '../../../components/utils/auth';
import { notify } from '../../../components/notifications';
import { ToastContainer } from 'react-toastify';

const VerifyLogin = () => {
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
                    // Store the JWT token
                    AuthUtils.setToken(response.data.token);
                    setVerificationStatus('success');
                    notify.success('Login successful!');

                    // Redirect to dashboard after short delay
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {verificationStatus === 'verifying' && (
                        <>
                            <div className="mb-4">
                                <i className="ri-loader-4-line animate-spin text-4xl text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold">Verifying your login...</h2>
                            <p className="mt-2 text-gray-600">Please wait while we verify your login attempt.</p>
                        </>
                    )}

                    {verificationStatus === 'success' && (
                        <>
                            <div className="mb-4 text-green-500">
                                <i className="ri-check-line text-4xl" />
                            </div>
                            <h2 className="text-xl font-semibold text-green-600">Login Verified!</h2>
                            <p className="mt-2 text-gray-600">Redirecting you to your dashboard...</p>
                        </>
                    )}

                    {verificationStatus === 'error' && (
                        <>
                            <div className="mb-4 text-red-500">
                                <i className="ri-error-warning-line text-4xl" />
                            </div>
                            <h2 className="text-xl font-semibold text-red-600">Verification Failed</h2>
                            <p className="mt-2 text-gray-600">Please try logging in again.</p>
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Return to Login
                            </button>
                        </>
                    )}
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default VerifyLogin;