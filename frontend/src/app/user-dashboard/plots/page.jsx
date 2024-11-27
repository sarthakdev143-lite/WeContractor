"use client"

import React, { useState, useEffect } from 'react';
import { MYAXIOS } from "@/components/Helper";
import { MapPin, Ruler, Info, ImageIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatIndianCurrency } from "@/components/sell/utils";

const PlotCard = ({ plot }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Placeholder Image or First Image */}
            <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                {plot.imageUrls && plot.imageUrls.length > 0 ? (
                    <img
                        src={plot.imageUrls[0]}
                        alt={plot.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon size={48} />
                        <p>No Image Available</p>
                    </div>
                )}
                {/* Price Overlay */}
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    ₹ {formatIndianCurrency(plot.price)}
                </div>
            </div>

            {/* Plot Details */}
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{plot.title}</h2>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        <span>{plot.location}</span>
                    </div>
                    <div className="flex items-center">
                        <Ruler size={16} className="mr-2 text-green-500" />
                        <span>{plot.length} x {plot.breadth} m²</span>
                    </div>
                </div>

                {/* Expandable Description */}
                <div className="relative">
                    <p className={`text-gray-700 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                        {plot.description}
                    </p>
                    {plot.description && plot.description.length > 100 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-500 hover:text-blue-600 text-sm mt-1 flex items-center"
                        >
                            {isExpanded ? 'Show Less' : 'Read More'}
                            <ChevronRight size={16} className="ml-1" />
                        </button>
                    )}
                </div>

                {/* Additional Info */}
                <div className="mt-4 border-t pt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">Plot Type</span>
                        <p className="font-medium">{plot.plotType || 'Not Specified'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Status</span>
                        <p className={`font-medium ${plot.isSold ? 'text-red-500' : 'text-green-500'}`}>
                            {plot.isSold ? 'Sold' : 'Available'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserPlots = () => {
    const [plots, setPlots] = useState([]); // Initialize with empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        plotType: '',
        minPrice: '',
        maxPrice: '',
        status: ''
    });
    const router = useRouter();

    useEffect(() => {
        const fetchUserPlots = async () => {
            console.log("Fetching Plots For User...");
            try {
                const response = await MYAXIOS.get('/api/user/plots', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Server Response : ", response);
                // Ensure plots is always an array
                setPlots(response.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Error Fetching Plots : ", err);
                setError('Failed to fetch plots');
                setLoading(false);
                // Ensure plots is an empty array in case of error
                setPlots([]);
            }
        };

        fetchUserPlots();
    }, []);

    // Add a safe filter method that checks if plots is defined
    const filteredPlots = (plots || []).filter(plot => {
        // Only apply filters if plot is defined
        console.log("Filtering : ", plot);
        if (!plot) return false;
        const matchPlotType = !filters.plotType || plot.plotType === filters.plotType;
        const matchMinPrice = !filters.minPrice || (plot.price >= parseFloat(filters.minPrice));
        const matchMaxPrice = !filters.maxPrice || (plot.price <= parseFloat(filters.maxPrice));
        const matchStatus = !filters.status ||
            (filters.status === 'sold' && plot.isSold) ||
            (filters.status === 'available' && !plot.isSold);

        return matchPlotType && matchMinPrice && matchMaxPrice && matchStatus;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <Info className="inline-block mr-2" />
            {error}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex items-center">
                <button
                    onClick={() => router.push('/user-dashboard')}
                    className="flex items-center text-gray-700 hover:text-gray-900 mb-4 mr-4"
                >
                    <ArrowLeft size={24} className="mr-2" />
                    <span>Back to Dashboard</span>
                </button>
            </div>

            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Plots</h1>

                {/* Filters */}
                <div className="grid md:grid-cols-4 gap-4">
                    <select
                        className="border rounded p-2"
                        value={filters.plotType}
                        onChange={(e) => setFilters({ ...filters, plotType: e.target.value })}
                    >
                        <option value="">All Plot Types</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="agricultural">Agricultural</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Min Price"
                        className="border rounded p-2"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        className="border rounded p-2"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />

                    <select
                        className="border rounded p-2"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>

                {/* Plot Count */}
                <div className="mt-4 text-gray-600">
                    Showing {filteredPlots.length} of {plots.length} plots
                </div>
            </div>

            {filteredPlots.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <Info className="mx-auto mb-4" size={48} />
                    <p>No plots match your current filters.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlots.map((plot, index) => (
                        <PlotCard key={index} plot={plot} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserPlots;