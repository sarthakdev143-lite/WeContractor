"use client";

import React, { useState } from "react";
import { Star, MapPin, Check, Heart, Share2, Ruler, ShieldCheck } from "lucide-react";
import { formatIndianCurrency } from "./sell/utils";

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
}

const PlotDetails: React.FC<{ plotData: PlotData }> = ({ plotData }) => {
    const [mainImage, setMainImage] = useState(plotData.imageUrls?.[0] || '');

    const calculatePrice = () => {
        const basePrice = plotData.price;
        const discount = plotData.discount || 0;
        return basePrice - (basePrice * discount / 100);
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-2xl">
                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 p-12">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative group overflow-hidden rounded-2xl">
                            <img
                                src={mainImage}
                                alt={plotData.title}
                                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            {plotData.imageUrls?.map((img, index) => (
                                <div 
                                    key={index} 
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-8">
                        {/* Title and Location */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-neutral-900 mb-3 tracking-tight">
                                    {plotData.title}
                                </h1>
                                <div className="flex items-center text-neutral-600 text-base">
                                    <MapPin className="mr-2 text-blue-500" size={20} />
                                    {plotData.location}
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors group">
                                    <Heart className="text-neutral-500 group-hover:text-red-500 transition-colors" />
                                </button>
                                <button className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors group">
                                    <Share2 className="text-neutral-500 group-hover:text-blue-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-3">
                            <div className="flex text-yellow-400 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`transition-colors duration-300 ${
                                            i < Math.round(plotData.rating || 0)
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
                            <div className="bg-neutral-100 p-4 rounded-xl">
                                <h3 className="text-base font-semibold mb-2 text-neutral-700">Plot Type</h3>
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
                                    {plotData.length} x {plotData.breadth} meters
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
                                className={`py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold ${
                                    plotData.isSold 
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

                {/* Description Section */}
                <div className="bg-neutral-100/50 p-12 border-t border-neutral-200">
                    <h2 className="text-2xl font-bold mb-4 text-neutral-900">Property Description</h2>
                    <p className="text-neutral-700 text-base leading-relaxed">
                        {plotData.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlotDetails;