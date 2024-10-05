"use client"

import Link from 'next/link';
import logo from '@/assets/logo.png'
import Image from 'next/image';
import React, { useState } from 'react';

const Navbar = () => {
    const [LinkStyles] = useState("text-blue-600 font-medium hover:text-blue-800");
    const [isLoggedin, setIsLoggedin] = useState(false);

    return (
        <nav className="flex justify-between items-center sm:px-12 px-4 pb-3">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                <Image
                    className='max-w-40'
                    src={logo}
                    alt="Logo"
                />
            </Link>
            <div className="flex items-center sm:gap-6 gap-3 text-lg">
                {
                    isLoggedin ? <>
                        <Link href="/logout" className={LinkStyles}>Logout</Link>
                    </> : <>
                        <Link href="/signup" className={LinkStyles}>Signup</Link>
                        <Link href="/login" className={`${LinkStyles} text-white text-responsive-sm bg-blue-600 px-7 py-3 rounded hover:text-white`}>Login</Link>
                    </>
                }
            </div>
        </nav>
    );
};

export default Navbar;