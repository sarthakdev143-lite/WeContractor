// utils.js

// Format currency in Indian style
export const formatIndianCurrency = (value) => {
    if (!value) return "0";
    const number = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    return number.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    });
};

// Common validation patterns
const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-()]{10,}$/,
    username: /^[a-zA-Z0-9_]+$/,
    price: /^\₹[0-9,]+$/,
};

// Validation rules for signup form
export const validators = {
    fullName: (value) => {
        if (!value) return "Full name is required";
        if (value.length < 3) return "Full name should be at least 3 characters";
        if (value.trim() === '') return "Full name should not be blank";
        if (value.length > 50) return "Full name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Full name can only contain letters and spaces";
        return "";
    },

    username: (username) => {
        if (!username) return "Username is required";
        if (username.length < 3) return "Username must be at least 3 characters long";
        if (username.length > 20) return "Username cannot exceed 20 characters";
        if (!patterns.username.test(username)) return "Username can only contain letters, numbers, and underscores";
        return "";
    },

    email: (email) => {
        if (!email) return "Email is required";
        if (!patterns.email.test(email)) return "Please enter a valid email address";
        return "";
    },

    phoneNumber: (phoneNumber) => {
        if (!phoneNumber) return "Phone number is required";
        if (!patterns.phone.test(phoneNumber)) return "Please enter a valid phone number";
        if (phoneNumber.length < 10 || phoneNumber.length > 15) return "Phone number should be between 10 and 15 digits";
        return "";
    },

    password: (password) => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (password.length > 50) return "Password cannot exceed 50 characters";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character (!@#$%^&*)";
        return "";
    }
};

// Enhanced form validation for the plot listing form
export const validateForm = (formData) => {
    const errors = {};

    // Required fields validation with custom messages
    const requiredFields = {
        title: {
            message: "Title is required",
            validate: (value) => {
                if (value.length < 5) return "Title must be at least 5 characters";
                if (value.length > 100) return "Title cannot exceed 100 characters";
                return "";
            }
        },
        description: {
            message: "Description is required",
            validate: (value) => {
                if (value.length < 20) return "Description must be at least 20 characters";
                if (value.length > 1000) return "Description cannot exceed 1000 characters";
                return "";
            }
        },
        location: {
            message: "Location is required",
            validate: (value) => {
                if (value.length < 5) return "Location must be at least 5 characters";
                if (value.length > 200) return "Location cannot exceed 200 characters";
                return "";
            }
        },
        price: {
            message: "Price is required",
            validate: (value) => {
                const numericPrice = parseFloat(value.replace(/[^0-9.]/g, ''));
                if (numericPrice < 11000) return `The minimum price should be ₹${formatIndianCurrency(11000)}`;
                if (numericPrice > 1000000000) return "Price cannot exceed ₹100 crore";
                return "";
            }
        },
        plotType: { message: "Plot type is required" }
    };

    // Validate required fields
    Object.entries(requiredFields).forEach(([field, config]) => {
        if (!formData[field]) {
            errors[field] = config.message;
        } else if (config.validate) {
            const validationError = config.validate(formData[field]);
            if (validationError) errors[field] = validationError;
        }
    });

    // Validate plot dimensions if provided
    if (formData.length || formData.breadth) {
        ['length', 'breadth'].forEach(dim => {
            if (!formData[dim]) {
                errors[dim] = `${dim.charAt(0).toUpperCase() + dim.slice(1)} is required when specifying plot dimensions`;
            } else {
                const value = parseFloat(formData[dim]);
                if (isNaN(value) || value <= 0) {
                    errors[dim] = `${dim.charAt(0).toUpperCase() + dim.slice(1)} must be a positive number`;
                }
                if (value > 10000) {
                    errors[dim] = `${dim.charAt(0).toUpperCase() + dim.slice(1)} cannot exceed 10,000 feet`;
                }
            }
        });
    }

    // Validate discount if provided
    if (formData.discount) {
        const discountValue = parseFloat(formData.discount);
        if (isNaN(discountValue) || discountValue < 0) {
            errors.discount = "Discount must be a positive number";
        } else if (discountValue > 99) {
            errors.discount = "Discount cannot exceed 99%";
        }
    }

    // Validate images
    if (!formData.images || formData.images.length === 0) {
        errors.images = "At least one image is required";
    } else if (formData.images.length > 10) {
        errors.images = "Cannot upload more than 10 images";
    } else {
        // Validate image sizes
        formData.images.forEach((image, index) => {
            const sizeInMB = image.size / (1024 * 1024);
            if (sizeInMB > 1) {
                errors[`image_${index}`] = `Image ${image.name} exceeds 1MB limit`;
            }
        });
    }

    // Validate videos if provided
    if (formData.videos && formData.videos.length > 0) {
        if (formData.videos.length > 3) {
            errors.videos = "Cannot upload more than 3 videos";
        }
        // Validate video sizes
        formData.videos.forEach((video, index) => {
            const sizeInMB = video.size / (1024 * 1024);
            if (sizeInMB > 5) {
                errors[`video_${index}`] = `Video ${video.name} exceeds 5MB limit`;
            }
        });
    }

    return errors;
};

// Format handler for form inputs
export const formatValue = (name, value) => {
    switch (name) {
        case 'price':
            return value ? `₹${formatIndianCurrency(value)}` : '';
        case 'discount':
            return value ? Math.min(parseFloat(value), 99).toString() : '';
        case 'length':
        case 'breadth':
            return value ? value.replace(/[^\d.]/g, '') : '';
        default:
            return value;
    }
};

// General input change handler
export const handleChange = (e, setFormData) => {
    const { name, value } = e.target;
    const formattedValue = formatValue(name, value);

    setFormData(prev => ({
        ...prev,
        [name]: formattedValue
    }));
};