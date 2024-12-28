"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import logo from "../assets/logo.png";

const Navbar = () => {
    const { isLoggedIn, isLoading, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setShowLogoutModal(false);
        };

        if (showLogoutModal) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showLogoutModal]);

    const LogoutModal = () => (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowLogoutModal(false)}
        >
            <div
                className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to logout? You will need to login again to access resources.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => setShowLogoutModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            logout();
                            setShowLogoutModal(false);
                            if (isMenuOpen) toggleMenu();
                        }}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );

    const LogoutButton = ({ className = "" }) => (
        <button
            onClick={() => setShowLogoutModal(true)}
            className={`px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ${className}`}
        >
            Logout
        </button>
    );

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
        <>
            <nav className="w-full bg-slate-50 shadow-sm">
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
                                <Link
                                    href="/user-dashboard"
                                    className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                                >
                                    Dashboard
                                </Link>
                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                <Link href="/form/signup" className="text-blue-600 font-medium hover:text-blue-800">
                                    Signup
                                </Link>
                                <Link
                                    href="/form/login"
                                    className="text-white bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 w-full md:w-auto text-center"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden px-4 py-3 flex flex-col gap-3 bg-gray-50 border-t">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/user-dashboard"
                                    className="text-white text-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                                    onClick={toggleMenu}
                                >
                                    Dashboard
                                </Link>
                                <LogoutButton className="w-full" />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/form/signup"
                                    className="block text-blue-600 hover:text-blue-800 py-2"
                                    onClick={toggleMenu}
                                >
                                    Signup
                                </Link>
                                <Link
                                    href="/form/login"
                                    className="block text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={toggleMenu}
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && <LogoutModal />}
        </>
    );
};

export default Navbar;
