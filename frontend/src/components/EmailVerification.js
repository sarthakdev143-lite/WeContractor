'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { MYAXIOS } from './Helper';
import { notify } from './notifications';

// Custom Button Component
const Button = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        outline: "border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500",
        destructive: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Custom Alert Component
const Alert = ({
    variant = 'default',
    title,
    children
}) => {
    const variants = {
        default: "bg-gray-50 border-gray-200 text-gray-800",
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800"
    };

    return (
        <div className={`rounded-lg border p-4 ${variants[variant]}`}>
            {title && (
                <h3 className="font-semibold mb-1">{title}</h3>
            )}
            <div className="text-sm">{children}</div>
        </div>
    );
};

export default function EmailVerification({ token }) {
    const router = useRouter();
    const [status, setStatus] = useState({
        loading: true,
        success: false,
        message: ''
    });
    const [countdown, setCountdown] = useState(3);

    const verifyEmail = useCallback(async (verificationToken) => {
        if (!verificationToken) {
            notify.error('Verification token is missing');
            setStatus({
                loading: false,
                success: false,
                message: 'Verification token is missing'
            });
            return;
        }

        try {
            await MYAXIOS.get(`/api/auth/verify-email?token=${verificationToken}`);

            setStatus({
                loading: false,
                success: true,
                message: 'Email verified successfully!'
            });
            notify.success('Email verified successfully!');

            // Start countdown
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push('/form/login');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Verification failed';
            setStatus({
                loading: false,
                success: false,
                message: errorMessage
            });
            notify.error(errorMessage);
        }
    }, [router]);

    useEffect(() => {
        verifyEmail(token);
    }, [token, verifyEmail]);

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Email Verification
                        </h1>
                    </div>

                    <div className="space-y-6">
                        {status.loading ? (
                            <div className="flex flex-col items-center space-y-4 py-8">
                                <div className="relative">
                                    {/* Custom loader with double circles */}
                                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full" />
                                    <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                                </div>
                                <p className="text-lg text-gray-600 animate-pulse">
                                    Verifying your email address...
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="transform transition-all duration-500 hover:scale-110">
                                        {status.success ? (
                                            <div className="text-green-500 animate-fadeIn">
                                                <CheckCircle className="w-20 h-20" />
                                            </div>
                                        ) : (
                                            <div className="text-red-500 animate-fadeIn">
                                                <XCircle className="w-20 h-20" />
                                            </div>
                                        )}
                                    </div>

                                    <Alert
                                        variant={status.success ? "success" : "error"}
                                        title={status.success ? "Success!" : "Verification Failed"}
                                    >
                                        {status.message}
                                    </Alert>

                                    {status.success && (
                                        <div className="space-y-4 w-full">
                                            <p className="text-center text-sm text-gray-500">
                                                Redirecting to login in {countdown} seconds...
                                            </p>
                                            <Button
                                                className="w-full group"
                                                onClick={() => router.push('/form/login')}
                                            >
                                                Go to Login
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    )}

                                    {!status.success && (
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => verifyEmail(token)}
                                        >
                                            Try Again
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}