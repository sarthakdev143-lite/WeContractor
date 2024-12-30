"use client";

import React, { useEffect, useState } from "react";
import {
    Star, MapPin, Check, Heart, Share2, Ruler, ShieldCheck, ArrowLeft, ArrowRight, XIcon, Expand, Clipboard, ClipboardCheck, LandPlot
} from "lucide-react";
import { formatIndianCurrency } from "./sell/utils";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { AuthUtils } from "./utils/auth";
import Image from "next/image";

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
    const [isUpdating, setIsUpdating] = useState(false);

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

        // Prevent duplicate requests
        if (isUpdating) return;

        // Store the previous state for rollback
        const previousState = isLiked;

        try {
            setIsUpdating(true);

            // Optimistically update the UI
            setIsLiked(!isLiked);

            const AuthenticatedAxios = AuthUtils.createAuthenticatedAxios();

            // Make the API request
            if (!previousState) {
                await AuthenticatedAxios.post(`/api/favorites/add/${plotId}`);
            } else {
                await AuthenticatedAxios.delete(`/api/favorites/remove/${plotId}`);
            }

            // Show success message after successful API call
            toast.success(!previousState ? 'Added to favorites' : 'Removed from favorites', {
                duration: 2000,
                position: 'top-center'
            });

        } catch (error) {
            console.error('Error updating favorites:', error);

            // Revert the optimistic update on error
            setIsLiked(previousState);

            toast.error('Failed to update favorites', {
                duration: 2000,
                position: 'top-center'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const HeartButton = () => (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addToFavorite()}
            disabled={isUpdating}
            className={`p-2.5 sm:p-3 rounded-full ${isUpdating
                ? 'bg-neutral-200 cursor-not-allowed'
                : 'bg-neutral-100 hover:bg-neutral-200'
                } transition-colors group`}
        >
            <Heart
                className={`w-5 h-5 sm:w-7 sm:h-7 transition-all ${isLiked
                    ? 'text-red-500 fill-current'
                    : 'text-neutral-500 group-hover:text-red-500'
                    } ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
            />
        </motion.button>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 flex justify-center p-3 sm:p-4 md:p-6 lg:p-8"
        >
            {/* Fullscreen Gallery Overlay */}
            <AnimatePresence>
                {isFullscreenGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
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
                                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
                            >
                                <XIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                            </button>
                            <button
                                onClick={() => navigateFullscreenImage('prev')}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 sm:p-3 rounded-full"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                            </button>
                            <button
                                onClick={() => navigateFullscreenImage('next')}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 sm:p-3 rounded-full"
                            >
                                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 50 }}
                className="w-full max-w-[128rem] bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl h-fit overflow-hidden border border-neutral-100"
            >
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 p-4 sm:p-6 md:p-8 lg:p-12">
                    {/* Image Gallery Section */}
                    <div className="space-y-4 sm:space-y-6">
                        <motion.div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl">
                            <Image
                                src={mainImage}
                                alt={plotData.title}
                                className="w-full aspect-[4/3] object-cover"
                                width={1000}
                                height={1000}
                            />
                            <button
                                onClick={() => handleImageFullscreen(
                                    plotData.imageUrls?.findIndex(img => img === mainImage) || 0
                                )}
                                className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/50 hover:bg-black/30 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors"
                            >
                                <Expand className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </button>
                        </motion.div>

                        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto p-1 sm:p-2 scrollbar-hide">
                            {plotData.imageUrls?.map((img, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-shrink-0 cursor-pointer"
                                    onClick={() => setMainImage(img)}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md sm:rounded-lg transition-all duration-300 
                                        ${mainImage === img
                                                ? 'ring-2 ring-blue-500 scale-105'
                                                : 'opacity-60 hover:opacity-100 hover:scale-105'
                                            }`}
                                        width={1000}
                                        height={1000}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="space-y-6 sm:space-y-8">
                        {/* Title and Location */}
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <motion.h1
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-2 sm:mb-3 tracking-tight"
                                >
                                    {plotData.title}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center text-neutral-600 text-sm sm:text-base"
                                >
                                    <MapPin className="mr-1.5 sm:mr-2 text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                                    {plotData.location}
                                </motion.div>
                            </div>

                            <div className="flex space-x-2">
                                <HeartButton />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleCopyLink}
                                    className="p-2.5 sm:p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors group relative"
                                >
                                    {isCopied ? (
                                        <ClipboardCheck className="w-5 h-5 sm:w-7 sm:h-7 text-green-500" />
                                    ) : (
                                        <>
                                            <Share2 className="w-5 h-5 sm:w-7 sm:h-7 text-neutral-500 transition-opacity group-hover:opacity-0" />
                                            <Clipboard className="w-5 h-5 sm:w-7 sm:h-7 text-neutral-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="flex text-yellow-400 space-x-0.5 sm:space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${i < Math.round(plotData.rating || 0)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-neutral-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-neutral-600 text-xs sm:text-sm">
                                ({plotData.totalRatings || 0} ratings)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="bg-blue-50/50 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-blue-100">
                            <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                                    ₹{formatIndianCurrency(calculatePrice())}
                                </span>
                                {plotData.discount && (
                                    <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                        {plotData.discount}% OFF
                                    </span>
                                )}
                            </div>
                            {plotData.discount && (
                                <p className="text-neutral-500 mt-1 text-xs sm:text-sm">
                                    Original: <span className="line-through">₹{formatIndianCurrency(plotData.price)}</span>
                                </p>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-neutral-100 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-3 sm:gap-4">
                                <h3 className="text-sm sm:text-base font-semibold text-neutral-700 flex items-center">
                                    <LandPlot
                                        className="mr-1.5 sm:mr-2 text-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                                    /> Plot Type
                                </h3>
                                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 text-white rounded-md sm:rounded-lg text-xs sm:text-sm">
                                    {plotData.plotType}
                                </span>
                            </div>

                            <div className="bg-neutral-100 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                <div className="flex items-center mb-1.5 sm:mb-2">
                                    <Ruler className="mr-1.5 sm:mr-2 text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-semibold text-neutral-700 text-base sm:text-lg">Dimensions</span>
                                </div>
                                <p className="text-neutral-800 font-medium text-sm sm:text-base">
                                    {plotData.length ?? 'N/A'} ft. x {plotData.breadth ?? 'N/A'} ft. = <span className="font-semibold">
                                        {formatIndianCurrency(plotData.length && plotData.breadth ? plotData.length * plotData.breadth : 0)}
                                    </span> sq ft.
                                </p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-neutral-50 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-neutral-100">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-neutral-800">Amenities</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {plotData.amenities?.map((amenity, index) => (
                                    <div key={index} className="flex items-center text-green-700">
                                        <Check className="mr-1.5 sm:mr-2 text-green-500 w-6 h-6" />
                                        <span className="text-neutral-700 text-sm sm:text-lg">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <button
                                className={`py-3 sm:py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold text-sm sm:text-base ${plotData.isSold
                                    ? 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                disabled={plotData.isSold}
                            >
                                {plotData.isSold ? 'Sold Out' : 'Book Now'}
                            </button>
                            <button
                                className="border border-blue-500 text-blue-500 py-3 sm:py-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 font-semibold text-sm sm:text-base"
                            >
                                Contact Agent
                            </button>
                        </div>

                        {/* Guarantee */}
                        <div className="flex items-center text-green-700 bg-green-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-green-100">
                            <ShieldCheck className="mr-2 sm:mr-3 text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="font-medium text-xs sm:text-sm">Secure Transaction Guaranteed</span>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-neutral-100/50 p-4 sm:p-6 md:p-8 lg:p-12 border-t border-neutral-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Property Overview</h2>
                        {plotData.virtualTourUrl && (
                            <a
                                href={plotData.virtualTourUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs sm:text-sm hover:bg-blue-600 transition-colors w-fit"
                            >
                                Virtual Tour
                            </a>
                        )}
                    </div>
                    <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                        {plotData.description}
                    </p>
                </div>
            </motion.div>

            <Toaster />
        </motion.div>
    );
};

export default PlotDetails;