import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

const Buy = () => {
    const [properties, setProperties] = useState([
        { image: "https://plus.unsplash.com/premium_photo-1669735480838-a070c423b961?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Premium Residential Plot", description: "A spacious residential plot located in a prime area, perfect for building your dream home.", location: "Phoenix Citadel, Indore", price: 2000000, length: 50, breadth: 40, soldBy: "Realty Estates", rating: 3.5, dateAdded: "2024-10-01" },
        { image: "https://images.unsplash.com/photo-1637555754372-54538a035312?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Luxurious Villa", description: "A luxurious villa with modern amenities, perfect for family gatherings and relaxation.", location: "Villa Heights, Mumbai", price: 5000000, length: 80, breadth: 60, soldBy: "Realty Estates", rating: 4.5, dateAdded: "2024-10-02" },
        { image: "https://images.unsplash.com/photo-1506695041619-5dd4f46960b7?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Apartment in the City", description: "A comfortable and stylish apartment located in the heart of the city, perfect for solo travelers.", location: "City Square, New York", price: 1000000, length: 40, breadth: 30, soldBy: "Realty Estates", rating: 2.5, dateAdded: "2024-10-03" },
        { image: "https://images.unsplash.com/photo-1655367382408-59b9b8a11e92?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Cozy House", description: "A comfortable and spacious house located in the heart of the city, perfect for solo travelers.", location: "City Square, New York", price: 1000000, length: 40, breadth: 30, soldBy: "Realty Estates", rating: 2.5, dateAdded: "2024-10-04" },
        { image: "https://plus.unsplash.com/premium_photo-1674019235838-df82b9c83f4e?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Elegant Plot", description: "A beautiful plot with scenic views, perfect for a serene home.", location: "Green Valley, Shimla", price: 1500000, length: 60, breadth: 40, soldBy: "Hill Homes", rating: 4.0, dateAdded: "2024-10-05" },
        { image: "https://images.unsplash.com/photo-1587745890135-20db8c79b027?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Seaside Villa", description: "A luxurious villa overlooking the ocean, offering privacy and peace.", location: "Palm Beach, Goa", price: 8000000, length: 120, breadth: 100, soldBy: "Beachfront Estates", rating: 4.8, dateAdded: "2024-10-06" },
        { image: "https://images.unsplash.com/photo-1586859821520-523558cbebe8?q=80&w=1525&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Modern City Plot", description: "A modern plot in the heart of the bustling city.", location: "Tech Park, Bangalore", price: 2500000, length: 55, breadth: 45, soldBy: "Urban Landmarks", rating: 3.8, dateAdded: "2024-10-07" },
        { image: "https://images.unsplash.com/photo-1586860051507-b798d4821d2a?q=80&w=1525&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Countryside Plot", description: "A tranquil plot away from the city, perfect for building a farmhouse.", location: "Rural Hills, Kerala", price: 1200000, length: 90, breadth: 70, soldBy: "Nature Estates", rating: 4.2, dateAdded: "2024-10-08" },
        { image: "https://images.unsplash.com/photo-1635548758456-241032d7a8f2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Hillside Mansion", description: "A grand hillside mansion with panoramic views.", location: "Mountain View, Ooty", price: 9000000, length: 150, breadth: 120, soldBy: "Highland Realty", rating: 4.9, dateAdded: "2024-10-09" },
        { image: "https://images.unsplash.com/photo-1506744272967-64058cba4bec?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Luxury Apartments", description: "Premium luxury apartments in the city center.", location: "Metro Heights, Pune", price: 3500000, length: 50, breadth: 40, soldBy: "Skyline Group", rating: 4.5, dateAdded: "2024-10-10" },
        { image: "https://plus.unsplash.com/premium_photo-1674019234994-eceabbdd091d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Riverside Cottage", description: "A charming cottage near the river, ideal for a peaceful getaway.", location: "Riverfront, Manali", price: 2200000, length: 60, breadth: 50, soldBy: "Riverside Realty", rating: 4.7, dateAdded: "2024-10-11" },
    ]);

    const [sortType, setSortType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProperties, setFilteredProperties] = useState(properties);
    const sliderRef = useRef(null);

    const { minPrice, maxPrice } = useMemo(() => {
        const prices = properties.map(property => property.price);
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices)
        };
    }, [properties]);

    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

    useEffect(() => {
        filterProperties();
    }, [searchQuery, priceRange, properties]);

    useEffect(() => {
        // Update price range when min/max prices change
        setPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);


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
        const sortBy = e.target.value;
        setSortType(sortBy);
        sortProperties(sortBy);
    };

    const sortProperties = (sortBy) => {
        let sortedProperties = [...properties];

        switch (sortBy) {
            case 'price-low-to-high':
                sortedProperties.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-to-low':
                sortedProperties.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sortedProperties.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                sortedProperties.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            default:
                // No sorting
                break;
        }

        setProperties(sortedProperties);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filterProperties = () => {
        const filtered = properties.filter(
            (property) =>
                (property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    property.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
                property.price >= priceRange[0] &&
                property.price <= priceRange[1]
        );
        setFilteredProperties(filtered);
    };

    const getThumbPosition = (value) => {
        return ((value - minPrice) / (maxPrice - minPrice)) * 100;
    };

    const handleThumbMove = (index, clientX) => {
        const sliderBounds = sliderRef.current.getBoundingClientRect();
        const percent = Math.min(Math.max((clientX - sliderBounds.left) / sliderBounds.width, 0), 1);
        const value = Math.round(percent * (maxPrice - minPrice) + minPrice);

        if (index === 0) {
            setPriceRange([Math.min(value, priceRange[1] - 1), priceRange[1]]);
        } else {
            setPriceRange([priceRange[0], Math.max(value, priceRange[0] + 1)]);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {Array(fullStars).fill().map((_, index) => (
                    <i key={index} className="ri-star-fill text-yellow-500 text-[1.4rem]"></i>
                ))}
                {halfStar && <i className="ri-star-half-fill text-yellow-500 text-[1.4rem]"></i>}
                {Array(emptyStars).fill().map((_, index) => (
                    <i key={index} className="ri-star-line text-gray-300 text-[1.4rem]"></i>
                ))}
            </div>
        );
    };

    const getTimeSinceAdded = (dateAdded) => {
        const now = new Date();
        const added = new Date(dateAdded);
        const diffTime = Math.abs(now - added);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        }
        const years = Math.floor(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    };

    return (
        <section className="max-w-[120rem] w-full mx-auto h-fit md:p-8 p-4 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col">
            <div className="flex flex-wrap justify-between items-center mb-8 bg-white transition-shadow bg-opacity-50 backdrop-blur w-full px-6 py-4 rounded shadow-xl gap-6">
                <div id="sort-by" className="sm:w-1/4 w-full flex items-center gap-3">
                    <label htmlFor="sort" className="text-lg font-semibold text-gray-700 whitespace-nowrap">Sort By:</label>
                    <select
                        id="sort"
                        value={sortType}
                        onChange={handleSort}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-150"
                    >
                        <option value="">Featured</option>
                        <option value="price-low-to-high">Price: Low to High</option>
                        <option value="price-high-to-low">Price: High to Low</option>
                        <option value="rating">Avg. Customer Review</option>
                        <option value="newest">Newest Arrivals</option>
                    </select>
                </div>
                <div id="price-range" className="sm:w-1/3 w-full flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-700">Price Range:</label>
                    <div className="relative w-full h-6" ref={sliderRef}>
                        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-2"></div>
                        <div
                            className="absolute h-2 bg-blue-500 rounded-full top-2"
                            style={{
                                left: `${getThumbPosition(priceRange[0])}%`,
                                right: `${100 - getThumbPosition(priceRange[1])}%`
                            }}
                        ></div>
                        {[0, 1].map((index) => (
                            <div
                                key={index}
                                className="absolute w-6 h-6 bg-blue-500 rounded-full top-0 -ml-3 cursor-pointer"
                                style={{ left: `${getThumbPosition(priceRange[index])}%` }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const handleMouseMove = (event) => {
                                        handleThumbMove(index, event.clientX);
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
                        <span className="text-sm text-gray-600">₹{formatIndianPrice(priceRange[0])}</span>
                        <span className="text-sm text-gray-600">₹{formatIndianPrice(priceRange[1])}</span>
                    </div>
                </div>
                <div id="search-bar" className="sm:w-1/4 w-full">
                    <input
                        type="text"
                        placeholder="Search by title or location"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className="flex flex-wrap justify-center gap-8 w-full">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property, index) => (
                            <Link to={`/view/${index}`} target='_blank' key={index} className="w-full sm:w-[45%] md:w-[30%] h-fit">
                                <div className="flex flex-col bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                                    <div className="h-48 sm:h-64 md:h-72 bg-slate-300 relative">
                                        <img loading='lazy' src={property.image} alt="property first-look" className="w-full h-full object-cover" />
                                        <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                                            {getTimeSinceAdded(property.dateAdded)}
                                        </span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <p className="text-xl font-bold text-gray-800">{property.title}</p>
                                        <p className="text-sm text-gray-600">{property.description}</p>
                                        <p className="text-sm text-gray-700"><span className="font-semibold">Location:</span> {property.location}</p>
                                        <p className="text-sm text-gray-700 font-semibold">Price: <span className='text-lg'>₹{formatIndianPrice(property.price)}</span></p>
                                        <p className="text-sm text-gray-700"><span className="font-semibold">Plot Size:</span> {property.length}ft. x {property.breadth}ft. = {property.length * property.breadth} sq. feet</p>
                                        <p className="text-sm text-gray-700"><span className="font-semibold">Sold By:</span> {property.soldBy}</p>
                                        <p className="text-sm text-gray-700 flex items-center">
                                            <span className="font-semibold mr-2">Rating:</span>
                                            {renderStars(property.rating)} <span className="ml-2 text-gray-600">({property.rating}/5)</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-lg text-gray-500">No properties found matching your criteria.</p>
                    )}
                </div>
            </div>
            <p className='mt-16 text-center text-gray-500'>You have reached the end.</p>
        </section>
    );
};

export default Buy;

// TODO:
// Price Range Filter - Provide sliders or input fields for users to define a minimum and maximum price range.

//  Plot Size Filter - Include options for users to filter properties based on size (length x breadth) to ensure they find plots that meet their space requirements. This can be implemented with 2 input fields.

//  Property Type Filter - Enable users to filter properties based on type (e.g., residential, commercial, land, etc.). - This can be a checkbox list allowing multiple selections.

// Amenities Filter - Include filters for specific amenities, such as swimming pools, gardens, parking spaces, etc. Users can check boxes for the amenities desire. - This will basically search the input in the tags section of a property...

// Date Listed Sort properties based on when they were listed (e.g., newest first). This helps users find the most recent listings quickly.
