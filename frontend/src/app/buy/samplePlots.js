// TODO:

//  Plot Size Filter - Include options for users to filter properties based on size (length x breadth) to ensure they find plots that meet their space requirements.

//  Property Type Filter - Enable users to filter properties based on type (e.g., residential, commercial, land, etc.). - This can be a checkbox list allowing multiple selections.

// Amenities Filter - Include filters for specific amenities, such as swimming pools, gardens, parking spaces, etc. Users can check boxes for the amenities desire. - This will basically search the input in the tags section of a property...


properties = [
    {
        image: "https://plus.unsplash.com/premium_photo-1669735480838-a070c423b961?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Premium Residential Plot",
        description: "A spacious residential plot located in a prime area, perfect for building your dream home.",
        location: "Phoenix Citadel, Indore",
        price: 2000000,
        length: 50,
        breadth: 40,
        soldBy: "Realty Estates",
        rating: 3.5,
        dateAdded: new Date("Sat Oct 01 2024 12:30:00")
    },
    {
        image: "https://images.unsplash.com/photo-1637555754372-54538a035312?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Luxurious Villa",
        description: "A luxurious villa with modern amenities, perfect for family gatherings and relaxation.",
        location: "Villa Heights, Mumbai",
        price: 5000000,
        length: 80,
        breadth: 60,
        soldBy: "Realty Estates",
        rating: 4.5,
        dateAdded: new Date("Sun Oct 02 2024 15:45:30")
    },
    {
        image: "https://images.unsplash.com/photo-1506695041619-5dd4f46960b7?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Apartment in the City",
        description: "A comfortable and stylish apartment located in the heart of the city, perfect for solo travelers.",
        location: "City Square, New York",
        price: 1000000,
        length: 40,
        breadth: 30,
        soldBy: "Realty Estates",
        rating: 2.5,
        dateAdded: new Date("Mon Oct 03 2024 10:00:45")
    },
    {
        image: "https://images.unsplash.com/photo-1655367382408-59b9b8a11e92?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Cozy House",
        description: "A comfortable and spacious house located in the heart of the city, perfect for solo travelers.",
        location: "City Square, New York",
        price: 1000000,
        length: 40,
        breadth: 30,
        soldBy: "Realty Estates",
        rating: 2.5,
        dateAdded: new Date("Tue Oct 04 2024 09:15:20")
    },
    {
        image: "https://plus.unsplash.com/premium_photo-1674019235838-df82b9c83f4e?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Elegant Plot",
        description: "A beautiful plot with scenic views, perfect for a serene home.",
        location: "Green Valley, Shimla",
        price: 1500000,
        length: 60,
        breadth: 40,
        soldBy: "Hill Homes",
        rating: 4.0,
        dateAdded: new Date("Wed Oct 05 2024 14:20:35")
    },
    {
        image: "https://images.unsplash.com/photo-1587745890135-20db8c79b027?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Seaside Villa",
        description: "A luxurious villa overlooking the ocean, offering privacy and peace.",
        location: "Palm Beach, Goa",
        price: 8000000,
        length: 120,
        breadth: 100,
        soldBy: "Beachfront Estates",
        rating: 4.8,
        dateAdded: new Date("Thu Oct 05 2024 18:45:50")
    },
    {
        image: "https://images.unsplash.com/photo-1586859821520-523558cbebe8?q=80&w=1525&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Modern City Plot",
        description: "A modern plot in the heart of the bustling city.",
        location: "Tech Park, Bangalore",
        price: 2500000,
        length: 55,
        breadth: 45,
        soldBy: "Urban Landmarks",
        rating: 3.8,
        dateAdded: new Date("Fri Oct 01 2024 11:30:00")
    },
    {
        image: "https://images.unsplash.com/photo-1586860051507-b798d4821d2a?q=80&w=1525&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Countryside Plot",
        description: "A tranquil plot away from the city, perfect for building a farmhouse.",
        location: "Rural Hills, Kerala",
        price: 1200000,
        length: 90,
        breadth: 70,
        soldBy: "Nature Estates",
        rating: 4.2,
        dateAdded: new Date("Sat Oct 08 2023 08:00:15")
    },
    {
        image: "https://images.unsplash.com/photo-1635548758456-241032d7a8f2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Hillside Mansion",
        description: "A grand hillside mansion with panoramic views.",
        location: "Mountain View, Ooty",
        price: 9000000,
        length: 150,
        breadth: 120,
        soldBy: "Highland Realty",
        rating: 4.9,
        dateAdded: new Date("Sun Oct 09 2023 20:15:30")
    },
    {
        image: "https://images.unsplash.com/photo-1506744272967-64058cba4bec?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Luxury Apartments",
        description: "Premium luxury apartments in the city center.",
        location: "Metro Heights, Pune",
        price: 3500000,
        length: 50,
        breadth: 40,
        soldBy: "Skyline Group",
        rating: 4.5,
        dateAdded: new Date("Mon Oct 10 2022 17:30:45")
    },
    {
        image: "https://plus.unsplash.com/premium_photo-1674019234994-eceabbdd091d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Riverside Cottage",
        description: "A charming cottage near the river, ideal for a peaceful getaway.",
        location: "Riverbank, Manali",
        price: 3000000,
        length: 60,
        breadth: 50,
        soldBy: "Riverside Realty",
        rating: 4.3,
        dateAdded: new Date("Tue Oct 11 2023 12:05:25")
    },
]
