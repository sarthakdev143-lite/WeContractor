"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import logo from '../assets/logo.png'

const Navbar = () => {
    const { isLoggedIn, isLoading, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkStyles = "text-blue-600 font-medium hover:text-blue-800";
    const loginButtonStyles = "text-white bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 w-full md:w-auto text-center";

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    if (isLoading) {
        return (
            <nav className="w-full bg-white shadow-sm">
                <div className="flex justify-between items-center py-4 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
                    <div className="w-24 h-8 bg-gray-200 animate-pulse" />
                    <div className="hidden md:flex items-center gap-4">
                        <div className="w-20 h-8 bg-gray-200 animate-pulse" />
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="w-full bg-white">
            <div className="flex justify-between items-center py-4 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center">
                    <Image
                        className="w-20 md:w-24 h-auto"
                        src={logo}
                        alt="Logo"
                        priority
                    />
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:text-gray-800"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4 lg:gap-6">
                    {isLoggedIn ? (
                        <>
                            <Link href="/user-dashboard" className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
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
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-4 py-3 space-y-3 bg-gray-50 border-t">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/user-dashboard"
                                className="block text-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                                onClick={toggleMenu}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    toggleMenu();
                                }}
                                className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/form/signup"
                                className="block text-center text-blue-600 hover:text-blue-800 py-2"
                                onClick={toggleMenu}
                            >
                                Signup
                            </Link>
                            <Link
                                href="/form/login"
                                className={`block ${loginButtonStyles}`}
                                onClick={toggleMenu}
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;