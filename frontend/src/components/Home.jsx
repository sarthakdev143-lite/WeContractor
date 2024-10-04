import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-wrap gap-20 h-fit m-auto transform -translate-y-56 justify-center items-center">
            <Link to="/buy"
                className="text-3xl font-semibold py-10 px-20 bg-green-500 hover:bg-green-600 rounded-lg shadow-lg transition-all duration-300"
            >
                Buy
            </Link>
            <Link to="/sell"
                className="text-3xl font-semibold py-10 px-20 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg transition-all duration-300"
            >
                Sell
            </Link>
        </div>
    );
};

export default Home;
