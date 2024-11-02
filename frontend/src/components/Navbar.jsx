"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logo.png';
import { useAuth } from './hooks/useAuth';

const Navbar = () => {
    const { isLoggedIn, isLoading, logout } = useAuth();

    const linkStyles = "text-blue-600 font-medium hover:text-blue-800";
    const loginButtonStyles = "text-white bg-blue-600 px-7 py-3 rounded hover:bg-blue-700";

    if (isLoading) {
        return (
            <nav className="flex justify-between items-center py-5 sm:px-12 px-4 pb-3">
                <div className="w-24 h-8 bg-gray-200 animate-pulse" />
                <div className="flex items-center sm:gap-6 gap-3">
                    <div className="w-20 h-8 bg-gray-200 animate-pulse" />
                </div>
            </nav>
        );
    }

    return (
        <nav className="flex justify-between items-center py-5 sm:px-12 px-4 pb-3">
            <Link href="/" className="flex items-center">
                <Image
                    className="w-24 h-auto"
                    src={logo}
                    alt="Logo"
                    priority
                />
            </Link>
            <div className="flex items-center sm:gap-6 gap-3 text-lg">
                {isLoggedIn ? (
                    <button
                        onClick={logout}
                        className={linkStyles}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link href="/form/signup" className={linkStyles}>
                            Signup
                        </Link>
                        <Link href="/form/login" className={loginButtonStyles}>
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;