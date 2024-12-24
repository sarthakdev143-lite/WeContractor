"use client";

import React, { useEffect, useState } from "react";
import {
    Star, MapPin, Check, Heart, Share2, Ruler, ShieldCheck, ArrowLeft, ArrowRight, XIcon, Expand, Clipboard, ClipboardCheck, LandPlot
} from "lucide-react";
import { formatIndianCurrency } from "./sell/utils";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { AuthUtils } from "./utils/auth";

interface PlotData {
    title: string;
    description: string;
    location: string;
    price: number;
    discount?: number;
    length?: number;
    breadth?: number;
    plotType?: string;
    imageUrls?: string[];
    amenities?: string[];
    isSold?: boolean;
    rating?: number;
    totalRatings?: number;
    virtualTourUrl?: string;
}

const copiedToclipboard = () => toast.success('Link Copied To Clipboard!');

const PlotDetails: React.FC<{ plotData: PlotData }> = ({ plotData }) => {
    const [mainImage, setMainImage] = useState(plotData.imageUrls?.[0] || '');
    const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
    const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [plotId, setPlotId] = useState<string | null>(null);
    
    const handleCopyLink = () => {
        const linkToCopy = window.location.href; // Change this to the desired link
        navigator.clipboard.writeText(linkToCopy).then(() => {
            copiedToclipboard();
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset state after 2 seconds
        });
    };

    const calculatePrice = () => {
        const basePrice = plotData.price;
        const discount = plotData.discount || 0;
        return basePrice - (basePrice * discount / 100);
    };

    const handleImageFullscreen = (index: number) => {
        setCurrentFullscreenIndex(index);
        setIsFullscreenGallery(true);
    };

    const navigateFullscreenImage = (direction: 'next' | 'prev') => {
        const images = plotData.imageUrls || [];
        const newIndex = direction === 'next'
            ? (currentFullscreenIndex + 1) % images.length
            : (currentFullscreenIndex - 1 + images.length) % images.length;
        setCurrentFullscreenIndex(newIndex);
    };

    useEffect(() => {
        // Extract ID from the URL client-side
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        setPlotId(id);

        // Check if plot is in favorites when component mounts
        const checkFavoriteStatus = async () => {
            try {
                if (!AuthUtils.isAuthenticated()) return;

                const AuthenticatedAxios = AuthUtils.createAuthenticatedAxios();
                const response = await AuthenticatedAxios.get(`/api/favorites/check/${id}`);
                setIsLiked(response.data);
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, []);

    const addToFavorite = async () => {
        try {
            if (!AuthUtils.isAuthenticated()) {
                toast.error('Log in to save plots to Favorites.', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#333',
                        color: '#fff',
                        padding: '12px',
                        borderRadius: '8px'
                    },
                    icon: '🔒',
                });
                return;
            }

            if (!plotId) {
                toast.error('Plot ID is missing', {
                    duration: 2000,
                    position: 'top-center'
                });
                return;
            }

            const AuthenticatedAxios = AuthUtils.createAuthenticatedAxios();

            // Use proper HTTP methods for adding/removing favorites
            if (isLiked) {
                await AuthenticatedAxios.delete(`/api/favorites/remove/${plotId}`);
            } else {
                await AuthenticatedAxios.post(`/api/favorites/add/${plotId}`);
            }

            // Toggle liked state after successful API call
            setIsLiked(!isLiked);

            // Show success message
            toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites', {
                duration: 2000,
                position: 'top-center'
            });

        } catch (error) {
            console.error('Error updating favorites:', error);
            toast.error('Failed to update favorites', {
                duration: 2000,
                position: 'top-center'
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 py-12 px-4 flex justify-center"
        >
            {/* Fullscreen Gallery Overlay */}
            <AnimatePresence>
                {isFullscreenGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    >
                        <div className="relative w-full max-w-6xl h-[80vh]">
                            <motion.img
                                key={currentFullscreenIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={plotData.imageUrls?.[currentFullscreenIndex]}
                                alt={`Fullscreen ${currentFullscreenIndex + 1}`}
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={() => setIsFullscreenGallery(false)}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
                            >
                                <XIcon className="text-white" />
                            </button>
                            <button
                                onClick={() => navigateFullscreenImage('prev')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full"
                            >
                                <ArrowLeft className="text-white" />
                            </button>
                            <button
                                onClick={() => navigateFullscreenImage('next')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full"
                            >
                                <ArrowRight className="text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 50 }}
                className="w-full max-w-[128rem] bg-white rounded-3xl shadow-2xl h-fit overflow-hidden border border-neutral-100 transform transition-all duration-300 hover:shadow-3xl"
            >
                <div className="grid md:grid-cols-2 gap-12 p-12">
                    {/* Enhanced Image Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            className="relative overflow-hidden rounded-2xl"
                        >
                            <img
                                src={mainImage}
                                alt={plotData.title}
                                className="w-full aspect-[4/3] object-cover"
                            />
                            <button
                                onClick={() => handleImageFullscreen(
                                    plotData.imageUrls?.findIndex(img => img === mainImage) || 0
                                )}
                                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/30 p-2 rounded-full backdrop-blur-sm transition-colors"
                            >
                                <Expand className="text-white" />
                            </button>
                        </motion.div>

                        <div className="flex space-x-3 overflow-x-auto p-2">
                            {plotData.imageUrls?.map((img, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-shrink-0 cursor-pointer"
                                    onClick={() => setMainImage(img)}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-lg transition-all duration-300 
                                            ${mainImage === img
                                                ? 'ring-2 ring-blue-500 scale-105'
                                                : 'opacity-60 hover:opacity-100 hover:scale-105'
                                            }`}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-8">
                        {/* Title and Location */}
                        <div className="flex justify-between items-start">
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-bold text-neutral-900 mb-3 tracking-tight"
                                >
                                    {plotData.title}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center text-neutral-600 text-base"
                                >
                                    <MapPin className="mr-2 text-blue-500" size={20} />
                                    {plotData.location}
                                </motion.div>
                            </div>

                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => addToFavorite()}
                                    className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors group"
                                >
                                    <Heart
                                        className={`transition-colors ${isLiked
                                            ? 'text-red-500 fill-current'
                                            : 'text-neutral-500 group-hover:text-red-500'
                                            }`}
                                    />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleCopyLink}
                                    className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors group relative"
                                >
                                    {isCopied ? (
                                        <ClipboardCheck className="text-green-500" />
                                    ) : (
                                        <>
                                            <Share2 className="text-neutral-500 transition-opacity group-hover:opacity-0" />
                                            <Clipboard className="text-neutral-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </>
                                    )}
                                </motion.button>

                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-3">
                            <div className="flex text-yellow-400 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`transition-colors duration-300 ${i < Math.round(plotData.rating || 0)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-neutral-300'
                                            }`}
                                        size={20}
                                    />
                                ))}
                            </div>
                            <span className="text-neutral-600 text-sm">
                                ({plotData.totalRatings || 0} ratings)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                            <div className="flex items-center space-x-4">
                                <span className="text-4xl font-bold text-blue-600">
                                    ₹{formatIndianCurrency(calculatePrice())}
                                </span>
                                {plotData.discount && (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        {plotData.discount}% OFF
                                    </span>
                                )}
                            </div>
                            {plotData.discount && (
                                <p className="text-neutral-500 mt-1 text-sm">
                                    Original: <span className="line-through">₹{formatIndianCurrency(plotData.price)}</span>
                                </p>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-neutral-100 p-4 rounded-xl flex items-center gap-4">
                                <h3 className="text-base font-semibold text-neutral-700 flex">
                                    <LandPlot
                                        size={18}
                                        className="mr-2 text-blue-500"
                                    /> Plot Type
                                </h3>
                                <span className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
                                    {plotData.plotType}
                                </span>
                            </div>

                            <div className="bg-neutral-100 p-4 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <Ruler className="mr-2 text-blue-500" size={18} />
                                    <span className="font-semibold text-neutral-700 text-base">Dimensions</span>
                                </div>
                                <p className="text-neutral-800 font-medium">
                                    {plotData.length ?? 'N/A'} ft.  x {plotData.breadth ?? 'N/A'} ft. = <span className="font-semibold">
                                        {/* {} */}
                                        {formatIndianCurrency(plotData.length && plotData.breadth ? plotData.length * plotData.breadth : 0)}
                                    </span> sq ft.
                                </p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-100">
                            <h3 className="text-base font-semibold mb-3 text-neutral-800">Amenities</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {plotData.amenities?.map((amenity, index) => (
                                    <div key={index} className="flex items-center text-green-700">
                                        <Check className="mr-2 text-green-500" size={18} />
                                        <span className="text-neutral-700 text-sm">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className={`py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold ${plotData.isSold
                                    ? 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                disabled={plotData.isSold}
                            >
                                {plotData.isSold ? 'Sold Out' : 'Book Now'}
                            </button>
                            <button
                                className="border border-blue-500 text-blue-500 py-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 font-semibold"
                            >
                                Contact Agent
                            </button>
                        </div>

                        {/* Guarantee */}
                        <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">
                            <ShieldCheck className="mr-3 text-green-500" size={24} />
                            <span className="font-medium text-sm">Secure Transaction Guaranteed</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Description Section with Tab-like Layout */}
                <div className="bg-neutral-100/50 p-12 border-t border-neutral-200">
                    <div className="flex items-center space-x-4 mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">Property Overview</h2>
                        {plotData.virtualTourUrl && (
                            <a
                                href={plotData.virtualTourUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                            >
                                Virtual Tour
                            </a>
                        )}
                    </div>
                    <p className="text-neutral-700 text-base leading-relaxed">
                        {plotData.description}
                    </p>
                </div>
            </motion.div>

            <Toaster />
        </motion.div>
    );
};

export default PlotDetails;