'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { MYAXIOS } from '../components/Helper';

export default function EmailVerification({ token }) {
    const router = useRouter();
    const [status, setStatus] = useState({
        loading: true,
        success: false,
        message: ''
    });

    useEffect(() => {
        if (!token) {
            toast.error('Verification token is missing');
            return;
        }
        verifyEmail(token);
    }, [token]);

    const verifyEmail = async (token) => {
        try {
            const response = await MYAXIOS.get(`/api/auth/verify-email?token=${token}`);

            setStatus({
                loading: false,
                success: true,
                message: 'Email verified successfully!'
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/form/login');
            }, 3500);

        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                message: error.response?.data?.message || 'Verification failed'
            });
        }
    };

    return (
        <div className="max-w-md w-full m-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
                    Email Verification
                </h2>

                {status.loading ? (
                    <div className="mt-8 flex flex-col items-center space-y-4">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-lg text-gray-600">Verifying your email...</p>
                    </div>
                ) : (
                    <div className="mt-8 flex flex-col items-center space-y-4">
                        {status.success ? (
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        ) : (
                            <XCircle className="w-16 h-16 text-red-500" />
                        )}

                        <p className={`text-lg font-medium ${status.success ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {status.message}
                        </p>

                        {status.success && (
                            <div className="mt-6">
                                <button
                                    onClick={() => router.push('/form/login')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                >
                                    Go to Login
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}