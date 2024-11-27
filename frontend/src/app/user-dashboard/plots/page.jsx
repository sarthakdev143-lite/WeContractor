"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MYAXIOS } from "@/components/Helper";
import { MapPin, Ruler, Info, ImageIcon, ChevronRight, ArrowLeft, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatIndianCurrency } from "@/components/sell/utils";
import Image from 'next/image';

const PlotCard = ({ plot }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Placeholder Image or First Image */}
            <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                {plot.imageUrls && plot.imageUrls.length > 0 ? (
                    <Image
                        src={plot.imageUrls[0]}
                        alt={plot.title}
                        className="w-full h-full object-cover"
                        width={1000}
                        height={450}
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
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleFilters, setToggleFilters] = useState(false);
    const priceSliderRef = useRef(null);
    const plotSizeSliderRef = useRef(null);

    const { minPrice, maxPrice, minPlotSize, maxPlotSize } = useMemo(() => {
        const prices = plots.map(plot => plot.price);
        const plotSizes = plots.map(plot => plot.length * plot.breadth);
        return {
            minPrice: prices.length ? Math.min(...prices) : 0,
            maxPrice: prices.length ? Math.max(...prices) : 0,
            minPlotSize: plotSizes.length ? Math.min(...plotSizes) : 0,
            maxPlotSize: plotSizes.length ? Math.max(...plotSizes) : 0
        };
    }, [plots]);

    const [sortType, setSortType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [plotSizeRange, setPlotSizeRange] = useState([minPlotSize, maxPlotSize]);
    const [availabilityFilter, setAvailabilityFilter] = useState('all');

    const router = useRouter();

    useEffect(() => {
        const fetchUserPlots = async () => {
            try {
                const response = await MYAXIOS.get('/api/user/plots', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setPlots(response.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Error Fetching Plots : ", err);
                setError('Failed to fetch plots');
                setLoading(false);
                setPlots([]);
            }
        };

        fetchUserPlots();
    }, []);

    // Update price and plot size ranges when plots change
    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
        setPlotSizeRange([minPlotSize, maxPlotSize]);
    }, [minPrice, maxPrice, minPlotSize, maxPlotSize]);

    const filteredPlots = plots.filter(plot => {
        const matchSearch = !searchQuery ||
            plot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plot.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchPrice = plot.price >= priceRange[0] && plot.price <= priceRange[1];
        const matchPlotSize = (plot.length * plot.breadth) >= plotSizeRange[0] &&
            (plot.length * plot.breadth) <= plotSizeRange[1];
        const matchAvailability = availabilityFilter === 'all' ||
            (availabilityFilter === 'available' && !plot.isSold) ||
            (availabilityFilter === 'sold' && plot.isSold);

        return matchSearch && matchPrice && matchPlotSize && matchAvailability;
    });

    const sortedPlots = useMemo(() => {
        let sortedList = [...filteredPlots];
        switch (sortType) {
            case 'price-low-to-high':
                return sortedList.sort((a, b) => a.price - b.price);
            case 'price-high-to-low':
                return sortedList.sort((a, b) => b.price - a.price);
            case 'newest':
                return sortedList.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'available-first':
                return sortedList.sort((a, b) => (a.isSold ? 1 : -1));
            case 'sold-first':
                return sortedList.sort((a, b) => (b.isSold ? 1 : -1));
            default:
                return sortedList;
        }
    }, [filteredPlots, sortType]);

    const getThumbPosition = (value, min, max) => {
        return ((value - min) / (max - min)) * 100;
    };

    const handleThumbMove = (index, clientX, rangeState, setRangeState, minValue, maxValue, sliderRef) => {
        const sliderBounds = sliderRef.current.getBoundingClientRect();
        const percent = Math.min(Math.max((clientX - sliderBounds.left) / sliderBounds.width, 0), 1);
        const value = Math.round(percent * (maxValue - minValue) + minValue);

        if (index === 0) {
            setRangeState([Math.min(value, rangeState[1] - 1), rangeState[1]]);
        } else {
            setRangeState([rangeState[0], Math.max(value, rangeState[0] + 1)]);
        }
    };

    const resetFilters = () => {
        setSortType('');
        setSearchQuery('');
        setPriceRange([minPrice, maxPrice]);
        setPlotSizeRange([minPlotSize, maxPlotSize]);
    };

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
                    className="flex items-center text-gray-700 hover:text-gray-900 mb-4 md:-ml-4 -ml-3 bg-slate-200 px-4 py-4 rounded-xl hover:bg-slate-300 transition"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    <span>Back to Dashboard</span>
                </button>
            </div>

            <div id="filters-wrapper" className={`${toggleFilters ? 'max-h-[1000px]' : 'max-h-0'} overflow-hidden mb-6`}>
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="grid md:grid-cols-2 gap-4 md:max-w-1/2">
                        <div className="flex md:flex-col gap-4">
                            <div className="flex gap-4">
                                {/* Sort Dropdown - Updated with new sorting options */}
                                <div id="sort-by" className='flex-grow'>
                                    <select
                                        value={sortType}
                                        onChange={(e) => setSortType(e.target.value)}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="">Featured</option>
                                        <option value="price-low-to-high">Price: Low to High</option>
                                        <option value="price-high-to-low">Price: High to Low</option>
                                        <option value="newest">Newest First</option>
                                        <option value="available-first">Available First</option>
                                        <option value="sold-first">Sold First</option>
                                    </select>
                                </div>

                                {/* Availability Filter */}
                                <div id="availability-filter" className='flex-grow'>
                                    <select
                                        value={availabilityFilter}
                                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="all">All Plots</option>
                                        <option value="available">Available Plots</option>
                                        <option value="sold">Sold Plots</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-12">
                                {/* Price Range Slider */}
                                <div id="price-range" className="relative w-full translate-x-3" ref={priceSliderRef}>
                                    <div className="relative w-full h-6">
                                        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-2"></div>
                                        <div
                                            className="absolute h-2 bg-blue-500 rounded-full top-2"
                                            style={{
                                                left: `${getThumbPosition(priceRange[0], minPrice, maxPrice)}%`,
                                                right: `${100 - getThumbPosition(priceRange[1], minPrice, maxPrice)}%`
                                            }}
                                        ></div>
                                        {[0, 1].map((index) => (
                                            <div
                                                key={index}
                                                className="absolute w-6 h-6 bg-blue-500 rounded-full top-0 -ml-3 cursor-pointer"
                                                style={{ left: `${getThumbPosition(priceRange[index], minPrice, maxPrice)}%` }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    const handleMouseMove = (event) => {
                                                        handleThumbMove(index, event.clientX, priceRange, setPriceRange, minPrice, maxPrice, priceSliderRef);
                                                    };
                                                    const handleMouseUp = () => {
                                                        document.removeEventListener('mousemove', handleMouseMove);
                                                        document.removeEventListener('mouseup', handleMouseUp);
                                                    };
                                                    document.addEventListener('mousemove', handleMouseMove);
                                                    document.addEventListener('mouseup', handleMouseUp);
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm text-gray-600">₹{formatIndianCurrency(priceRange[0])}</span>
                                        <span className="text-sm text-gray-600">₹{formatIndianCurrency(priceRange[1])}</span>
                                    </div>
                                </div>

                                {/* Plot Size Range Slider */}
                                <div id="plot-size-range" className="relative w-full" ref={plotSizeSliderRef}>
                                    <div className="relative w-full h-6">
                                        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-2"></div>
                                        <div
                                            className="absolute h-2 bg-green-500 rounded-full top-2"
                                            style={{
                                                left: `${getThumbPosition(plotSizeRange[0], minPlotSize, maxPlotSize)}%`,
                                                right: `${100 - getThumbPosition(plotSizeRange[1], minPlotSize, maxPlotSize)}%`
                                            }}
                                        ></div>
                                        {[0, 1].map((index) => (
                                            <div
                                                key={index}
                                                className="absolute w-6 h-6 bg-green-500 rounded-full top-0 -ml-3 cursor-pointer"
                                                style={{ left: `${getThumbPosition(plotSizeRange[index], minPlotSize, maxPlotSize)}%` }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    const handleMouseMove = (event) => {
                                                        handleThumbMove(index, event.clientX, plotSizeRange, setPlotSizeRange, minPlotSize, maxPlotSize, plotSizeSliderRef);
                                                    };
                                                    const handleMouseUp = () => {
                                                        document.removeEventListener('mousemove', handleMouseMove);
                                                        document.removeEventListener('mouseup', handleMouseUp);
                                                    };
                                                    document.addEventListener('mousemove', handleMouseMove);
                                                    document.addEventListener('mouseup', handleMouseUp);
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm text-gray-600">{plotSizeRange[0]} m²</span>
                                        <span className="text-sm text-gray-600">{plotSizeRange[1]} m²</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-3 justify-end">
                            {/* Search Input */}
                            <div id="search-bar" className='flex justify-end'>
                                <input
                                    type="text"
                                    placeholder="Search plots"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-2/4 border rounded p-2 h-fit"
                                />
                            </div>

                            {/* Reset Filters Button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 bg-red-500 text-white h-fit rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                >
                                    <Filter size={16} className="mr-2" />
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Plot Count */}
                    <div className="mt-4 text-gray-600">
                        Showing {sortedPlots.length} of {plots.length} plots
                    </div>
                </div>
            </div>

            {/* Toggle Filters Button */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setToggleFilters(!toggleFilters)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {toggleFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {
                sortedPlots.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <Info className="mx-auto mb-4" size={48} />
                        <p>No plots match your current filters.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedPlots.map((plot, index) => (
                            <PlotCard key={index} plot={plot} />
                        ))}
                    </div>
                )
            }
        </div >
    );
}

export default UserPlots;