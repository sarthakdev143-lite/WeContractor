import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

const Navbar = () => {
    const [LinkStyles] = useState("text-2xl text-blue-600 font-medium hover:text-blue-800");
    const [isLoggedin, setisLoggedin] = useState(false);

    return (
        <nav className="flex justify-between items-center px-12 pb-3">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                <img className='h-32' src={logo} alt="logo" />
            </Link>
            <div className="flex items-center space-x-6 text-lg">
                {
                    isLoggedin ? <>
                        <Link to="/logout" className={LinkStyles}>Logout</Link>
                    </> : <>
                        <Link to="/signup" className={LinkStyles}>Signup</Link>
                        <Link to="/login" className={`${LinkStyles} text-white bg-blue-600 px-7 py-3 rounded hover:text-white`}>Login</Link>
                    </>
                }
            </div>
        </nav>
    );
};

export default Navbar;
