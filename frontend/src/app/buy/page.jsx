"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MYAXIOS } from '@/components/Helper';
import { Eye, MapPin, Tag, Ruler, Star, Clock, Building2 } from 'lucide-react';
import PropertyCardSkeleton from './PropertyCardSkeleton';

const Buy = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortType, setSortType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedPlotTypes, setSelectedPlotTypes] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedViews, setSelectedViews] = useState('all');

    const priceSliderRef = useRef(null);
    const plotSizeSliderRef = useRef(null);

    const skeletonArray = Array(6).fill(null);

    // Fetch properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true);
                const response = await MYAXIOS.get('/api/plots');

                const formattedProperties = response.data.map(prop => ({
                    ...prop,
                    // No need to create new Date object here as we'll parse it in getTimeSinceAdded
                    totalViews: Number(prop.totalViews) || 0,
                    rating: Number(prop.rating) || 0,
                    price: Number(prop.price) || 0,
                    length: Number(prop.length) || 0,
                    breadth: Number(prop.breadth) || 0,
                    discount: Number(prop.discount) || 0
                }));

                setProperties(formattedProperties);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch properties');
                setIsLoading(false);
                console.error('Error fetching properties:', err);
            }
        };

        fetchProperties();
    }, []);

    const { minPrice, maxPrice, minPlotSize, maxPlotSize, uniquePlotTypes } = useMemo(() => {
        const prices = properties.map(property => property.price);
        const plotSizes = properties.map(property => property.length * property.breadth);
        const types = [...new Set(properties.map(property => property.plotType))];

        return {
            minPrice: prices.length ? Math.min(...prices) : 0,
            maxPrice: prices.length ? Math.max(...prices) : 0,
            minPlotSize: plotSizes.length ? Math.min(...plotSizes) : 0,
            maxPlotSize: plotSizes.length ? Math.max(...plotSizes) : 0,
            uniquePlotTypes: types
        };
    }, [properties]);

    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [plotSizeRange, setPlotSizeRange] = useState([minPlotSize, maxPlotSize]);
    const [toggleFilters, setToggleFilters] = useState(false);

    // Move filterProperties outside of the component or memoize it
    const filterAndSortProperties = useCallback(() => {
        if (!properties.length) return [];

        let filtered = properties.filter(property => {
            const matchesSearch = (
                property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.tags.toLowerCase().includes(searchQuery.toLowerCase())
            );

            const matchesPrice = (
                property.price >= priceRange[0] &&
                property.price <= priceRange[1]
            );

            const matchesPlotSize = (
                (property.length * property.breadth) >= plotSizeRange[0] &&
                (property.length * property.breadth) <= plotSizeRange[1]
            );

            const matchesPlotType = (
                selectedPlotTypes.length === 0 ||
                selectedPlotTypes.includes(property.plotType)
            );

            const matchesRating = (
                selectedRating === 0 ||
                property.rating >= selectedRating
            );

            const matchesViews = (() => {
                switch (selectedViews) {
                    case 'low': return property.totalViews < 10000;
                    case 'medium': return property.totalViews >= 10000 && property.totalViews < 100000;
                    case 'high': return property.totalViews >= 100000;
                    default: return true;
                }
            })();

            return matchesSearch && matchesPrice && matchesPlotSize &&
                matchesPlotType && matchesRating && matchesViews;
        });

        // Apply sorting
        switch (sortType) {
            case 'price-low-to-high':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-to-low':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'most-viewed':
                filtered.sort((a, b) => b.totalViews - a.totalViews);
                break;
            case 'plot-size-asc':
                filtered.sort((a, b) => (a.length * a.breadth) - (b.length * b.breadth));
                break;
            case 'plot-size-desc':
                filtered.sort((a, b) => (b.length * b.breadth) - (a.length * a.breadth));
                break;
        }

        return filtered;
    }, [properties, searchQuery, priceRange, plotSizeRange, sortType, selectedPlotTypes, selectedRating, selectedViews]);

    // Update filteredProperties using useEffect
    useEffect(() => {
        setFilteredProperties(filterAndSortProperties());
    }, [filterAndSortProperties]);

    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
        setPlotSizeRange([minPlotSize, maxPlotSize]);
    }, [minPrice, maxPrice, minPlotSize, maxPlotSize]);

    const formatIndianPrice = (price) => {
        const priceString = price.toString();
        const [wholePart, decimalPart] = priceString.split('.');
        const lastThree = wholePart.substring(wholePart.length - 3);
        const otherNumbers = wholePart.substring(0, wholePart.length - 3);
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        const formattedWholePart = formattedOtherNumbers ? `${formattedOtherNumbers},${lastThree}` : lastThree;
        return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
    };

    const handleSort = (e) => {
        setSortType(e.target.value);
    };

    const handlePlotTypeChange = (type) => {
        setSelectedPlotTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const resetFilters = () => {
        setSortType('');
        setSearchQuery('');
        setPriceRange([minPrice, maxPrice]);
        setPlotSizeRange([minPlotSize, maxPlotSize]);
        setSelectedPlotTypes([]);
        setSelectedRating(0);
        setSelectedViews('all');
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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

    const getThumbPosition = (value, min, max) => {
        return ((value - min) / (max - min)) * 100;
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <span className="flex items-center">
                {Array(fullStars).fill().map((_, index) => (
                    <i key={index} className="ri-star-fill text-yellow-500 text-[1.4rem]"></i>
                ))}
                {halfStar && <i className="ri-star-half-fill text-yellow-500 text-[1.4rem]"></i>}
                {Array(emptyStars).fill().map((_, index) => (
                    <i key={index} className="ri-star-line text-gray-300 text-[1.4rem]"></i>
                ))}
            </span>
        );
    };

    const getTimeSinceAdded = useCallback((dateString) => {
        try {
            // Handle the specific date format with IST timezone
            const dateWithoutIST = dateString.replace(' IST', '');
            const added = new Date(dateWithoutIST);
            const now = new Date();

            if (isNaN(added.getTime())) {
                console.error('Invalid date:', dateString);
                return "Date unavailable";
            }

            const diffTime = Math.abs(now - added);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

            if (diffDays === 0) {
                if (diffHours === 0) {
                    if (diffMinutes === 0) {
                        return 'Just now';
                    }
                    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
                }
                return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            }

            if (diffDays < 30) {
                return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            }

            if (diffDays < 365) {
                const months = Math.floor(diffDays / 30);
                return `${months} month${months > 1 ? 's' : ''} ago`;
            }

            const years = Math.floor(diffDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        } catch (error) {
            console.error('Error calculating time since added:', error, 'for date:', dateString);
            return 'Date unavailable';
        }
    }, []);

    const formatTotalViews = (totalViews) => {
        if (totalViews >= 100000000000) return ('100B+')
        if (totalViews >= 1000000000) return (totalViews / 1000000000
        ).toFixed(1) + 'B';
        if (totalViews >= 1000000) return (totalViews / 1000000
        ).toFixed(2) + 'M';
        if (totalViews >= 1000) return (totalViews / 1000
        ).toFixed(2) + 'K';
        return totalViews;
    };

    const getPriceAfterDiscount = (price, discount) => {
        // Filter non-numeric characters 
        const filteredPrice = price ? price.toString().replace(/[^0-9.]/g, "") : "0";
        const filteredDiscount = discount ? discount.toString().replace(/[^0-9.]/g, "") : "0";

        // Parse the filtered values into numbers
        const validPrice = parseFloat(filteredPrice) || 0;
        const validDiscount = parseFloat(filteredDiscount) || 0;

        if (validPrice === 0) return 0;
        const priceAfterDiscount = (validPrice - ((validDiscount * validPrice) / 100));

        return priceAfterDiscount;
    };

    return (
        <section className="max-w-[120rem] w-full mx-auto h-fit md:p-8 sm:p-4 p-2 border border-gray-300 rounded-lg shadow-md bg-inherit flex flex-col gap-4">
            {isLoading ? (
                <div className="flex flex-wrap justify-center gap-4">
                    {skeletonArray.map((_, index) => (
                        <PropertyCardSkeleton key={index} />
                    ))}
                </div>
            ) : error ? (
                <div className="flex justify-center items-center">
                    <p className="text-red-500 text-xl">{error}</p>
                </div>
            ) : (
                <>
                    <div id="filters-wrapper"
                        className={`${toggleFilters ? 'max-h-[1000px]' : 'max-h-0'} 
                            transition-all duration-500 ease-in-out overflow-hidden`}>
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-6">
                            {/* Top Row - Search and Sort */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Search Properties
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by title or location"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            className="w-full p-3 pl-4 border border-gray-200 rounded-lg bg-gray-50 
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             transition duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Sort Properties
                                    </label>
                                    <select
                                        value={sortType}
                                        onChange={handleSort}
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         transition duration-200"
                                    >
                                        <option value="">Featured</option>
                                        <option value="price-low-to-high">Price: Low to High</option>
                                        <option value="price-high-to-low">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="most-viewed">Most Viewed</option>
                                        <option value="plot-size-asc">Plot Size: Small to Large</option>
                                        <option value="plot-size-desc">Plot Size: Large to Small</option>
                                    </select>
                                </div>
                            </div>

                            {/* Plot Types */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    Plot Types
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {uniquePlotTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handlePlotTypeChange(type)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 
                                              transition-all duration-200 ${selectedPlotTypes.includes(type)
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Building2 className="w-4 h-4" />
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sliders Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Price Range Slider */}
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Price Range
                                    </label>
                                    <div className="relative w-full h-6" ref={priceSliderRef}>
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
                                                className="absolute w-6 h-6 bg-blue-500 rounded-full top-0 -ml-3 cursor-pointer 
                                                 shadow-md hover:shadow-lg transition-shadow duration-200"
                                                style={{
                                                    left: `${getThumbPosition(priceRange[index], minPrice, maxPrice)}%`
                                                }}
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
                                    <div className="flex justify-between mt-1">
                                        <span className="text-sm text-gray-600">₹{formatIndianPrice(priceRange[0])}</span>
                                        <span className="text-sm text-gray-600">₹{formatIndianPrice(priceRange[1])}</span>
                                    </div>
                                </div>

                                {/* Plot Size Slider */}
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Plot Size (sq ft)
                                    </label>
                                    <div className="relative w-full h-6" ref={plotSizeSliderRef}>
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
                                                className="absolute w-6 h-6 bg-green-500 rounded-full top-0 -ml-3 cursor-pointer 
                                                 shadow-md hover:shadow-lg transition-shadow duration-200"
                                                style={{
                                                    left: `${getThumbPosition(plotSizeRange[index], minPlotSize, maxPlotSize)}%`
                                                }}
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
                                    <div className="flex justify-between mt-1">
                                        <span className="text-sm text-gray-600">{plotSizeRange[0]} sq ft</span>
                                        <span className="text-sm text-gray-600">{plotSizeRange[1]} sq ft</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row - Rating, Views, and Reset */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(Number(e.target.value))}
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         transition duration-200"
                                    >
                                        <option value={0}>All Ratings</option>
                                        <option value={4}>4+ Stars</option>
                                        <option value={3}>3+ Stars</option>
                                        <option value={2}>2+ Stars</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Views
                                    </label>
                                    <select
                                        value={selectedViews}
                                        onChange={(e) => setSelectedViews(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         transition duration-200"
                                    >
                                        <option value="all">All Views</option>
                                        <option value="high">High (100k+)</option>
                                        <option value="medium">Medium (10k-100k)</option>
                                        <option value="low">Low (&lt;10k)</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="w-full p-3 bg-red-500 text-white rounded-lg 
                                         hover:bg-red-600 active:bg-red-700
                                         transition-colors duration-200
                                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={() => setToggleFilters(!toggleFilters)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {toggleFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 w-full">
                        {filteredProperties.length > 0 ? (
                            filteredProperties.map((property, index) => (
                                <Link href={`/view/${property.title}/${property.id}`} target='_blank' key={index} className="w-full sm:w-[45%] lg:w-[30%] h-fit group">
                                    <Property property={property} index={index} getTimeSinceAdded={getTimeSinceAdded} formatTotalViews={formatTotalViews} formatIndianPrice={formatIndianPrice} getPriceAfterDiscount={getPriceAfterDiscount} renderStars={renderStars} />
                                </Link>
                            ))
                        ) : (
                            <p className="text-lg text-gray-500 text-center">No properties found matching your criteria.</p>
                        )}
                    </div>
                    <p className='mt-16 text-center text-gray-500'>You have reached the end.</p>
                </>
            )}
        </section>
    );
};

export default Buy;

const Property = ({ property, getTimeSinceAdded, formatTotalViews, formatIndianPrice, getPriceAfterDiscount, renderStars }) => {
    return (
        <div
            className="relative hover:-translate-y-1 transition-all duration-200 bg-white rounded-2xl shadow-lg overflow-hidden
                            border border-gray-100 hover:border-blue-100
                            hover:shadow-2xl cursor-pointer"
        >
            <div className="h-48 sm:h-64 md:h-72 relative overflow-hidden">
                <Image
                    src={property.image}
                    alt="property first-look"
                    width={400}
                    height={150}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
                    <div className="flex gap-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            {property.plotType}
                        </span>
                    </div>
                    <span className="bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeSinceAdded(property.dateAdded)}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2 flex-grow pr-2">
                        {property.title}
                    </h2>
                    <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        <Eye className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="text-xs font-medium">{formatTotalViews(property.totalViews)}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 italic">
                    {property.description}
                </p>

                <div className="flex items-center text-gray-700 space-x-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm truncate">{property.location}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <div className="bg-blue-50 p-2 rounded-lg flex items-center space-x-2 flex-grow-[1.9]">
                        <span className="bg-blue-100 p-1.5 rounded-full">
                            <Ruler className="w-4 h-4 text-blue-600" />
                        </span>
                        <div>
                            <p className="text-xs text-gray-500">Plot Size</p>
                            <p className="text-sm font-semibold">{property.length}ft x {property.breadth}ft</p>
                        </div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg flex items-center space-x-2 flex-grow-[2]">
                        <span className="bg-green-100 p-1.5 rounded-full">
                            <Star className="w-4 h-4 text-green-600" />
                        </span>
                        <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                <span className="line-through text-gray-400">₹{formatIndianPrice(property.price)}</span>
                                <span>₹{formatIndianPrice(getPriceAfterDiscount(property.price, property.discount))}</span>
                                <span className="text-xs text-red-600 font-medium">({property.discount}% OFF)</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Sold By: {property.soldBy}</p>
                    {property.rating > 0 && <div className="flex items-center space-x-1">
                        {renderStars(property.rating)}
                        <span className="text-xs text-gray-600 ml-1">
                            ({property.rating.toFixed(1)})
                        </span>
                    </div>}
                </div>
            </div>
        </div>
    );
}