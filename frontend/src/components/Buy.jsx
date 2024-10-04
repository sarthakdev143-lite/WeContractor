import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Buy = () => {
    const [properties, setProperties] = useState([
        { image: "https://plus.unsplash.com/premium_photo-1669735480838-a070c423b961?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Premium Residential Plot", description: "A spacious residential plot located in a prime area, perfect for building your dream home.", location: "Phoenix Citadel, Indore", price: 2000000, length: 50, breadth: 40, soldBy: "Realty Estates", rating: 3.5 },
        { image: "https://images.unsplash.com/photo-1637555754372-54538a035312?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Luxurious Villa", description: "A luxurious villa with modern amenities, perfect for family gatherings and relaxation.", location: "Villa Heights, Mumbai", price: 5000000, length: 80, breadth: 60, soldBy: "Realty Estates", rating: 4.5 },
        { image: "https://images.unsplash.com/photo-1637555754372-54538a035312?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Apartment in the City", description: "A comfortable and stylish apartment located in the heart of the city, perfect for solo travelers.", location: "City Square, New York", price: 1000000, length: 40, breadth: 30, soldBy: "Realty Estates", rating: 2.5 },
        { image: "https://images.unsplash.com/photo-1655367382408-59b9b8a11e92?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Cozy House", description: "A comfortable and spacious house located in the heart of the city, perfect for solo travelers.", location: "City Square, New York", price: 1000000, length: 40, breadth: 30, soldBy: "Realty Estates", rating: 2.5 }
    ]);

    const [sortType, setSortType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSort = (e) => {
        const sortBy = e.target.value;
        let sortedProperties = [...properties];

        if (sortBy === 'price') {
            sortedProperties.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'rating') {
            sortedProperties.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'area') {
            sortedProperties.sort((a, b) => (a.length * a.breadth) - (b.length * b.breadth));
        }

        setSortType(sortBy);
        setProperties(sortedProperties);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProperties = properties.filter(
        (property) =>
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    return (
        <section className="w-full h-fit p-8 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col">
            <div className="flex justify-between items-center mb-8 sticky top-4 z-10 bg-transparent backdrop-blur w-full px-6 py-4 rounded shadow-xl">
                <div id="search-bar" className="w-1/3">
                    <input
                        type="text"
                        placeholder="Search by title or location"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div id="sort-by" className="w-1/3">
                    <label htmlFor="sort" className="block text-lg font-semibold text-gray-700 mb-2">Sort By:</label>
                    <select
                        id="sort"
                        value={sortType}
                        onChange={handleSort}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="area">Area (sq. feet)</option>
                    </select>
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className="flex flex-wrap gap-8 w-full">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property, index) => (
                            <Link to={`/view/${index}`} target='_blank' key={index} className="w-full sm:w-[45%] md:w-[30%] h-fit">
                                <div className="flex flex-col bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-[1.025]">
                                    <div className="h-48 sm:h-64 md:h-72 bg-slate-300">
                                        <img loading='lazy' src={property.image} alt="property first-look" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <p className="text-xl font-bold text-gray-800">{property.title}</p>
                                        <p className="text-sm text-gray-600">{property.description}</p>
                                        <p className="text-sm text-gray-700"><span className="font-semibold">Location:</span> {property.location}</p>
                                        <p className="text-sm text-gray-700 font-semibold">Price: <span className='text-lg'>₹{property.price.toLocaleString()}</span></p>
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
        </section>
    );
};

export default Buy;
