"use client";

import { useState, useEffect } from 'react';

const LoadingSpinner = ({ type = 'default', size = 'default', text = 'Loading...' }) => {
    const [dots, setDots] = useState('');

    // Animated dots for text
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Size classes
    const sizeClasses = {
        small: 'h-8 w-8',
        default: 'h-12 w-12',
        large: 'h-16 w-16'
    };

    const containerClasses = "flex flex-col items-center justify-center min-h-[200px]";
    const textClasses = "mt-4 text-gray-600 font-medium";

    // Different spinner types
    const spinners = {
        default: (
            <div className={containerClasses}>
                <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin`}></div>
                <div className={textClasses}>{text}{dots}</div>
            </div>
        ),

        pulse: (
            <div className={containerClasses}>
                <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>
                <div className={textClasses}>{text}{dots}</div>
            </div>
        ),

        bounce: (
            <div className={containerClasses}>
                <div className="flex items-center space-x-2">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-4 w-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce`}
                            style={{ animationDelay: `${i * 0.15}s` }}
                        ></div>
                    ))}
                </div>
                <div className={textClasses}>{text}{dots}</div>
            </div>
        ),

        wave: (
            <div className={containerClasses}>
                <div className="relative flex justify-center items-center mb-2">
                    <div className={`${sizeClasses[size]} animate-ping absolute bg-blue-400 rounded-full opacity-75`}></div>
                    <div className={`${sizeClasses[size]} relative bg-blue-500 rounded-full`}></div>
                </div>
                <div className={textClasses}>{text}{dots}</div>
            </div>
        ),

        circle: (
            <div className={containerClasses}>
                <div className="relative">
                    <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}></div>
                    <div className={`${sizeClasses[size]} border-4 border-blue-500 rounded-full animate-spin absolute top-0 border-t-transparent`}></div>
                </div>
                <div className={textClasses}>{text}{dots}</div>
            </div>
        ),

        dots: (
            <div className={containerClasses}>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                    ))}
                </div>
                <div className={textClasses}>{text}{dots}</div>
            </div>
        ),
    };

    return spinners[type] || spinners.default;
};

export default LoadingSpinner;