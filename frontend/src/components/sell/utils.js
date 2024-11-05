export const validateForm = (formData) => {
    const errors = {};

    if (!formData.title) errors.title = "Title is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.price) errors.price = "Price is required";
    if (!formData.plotType) errors.plotType = "Plot type is required";
    if (formData.images.length === 0) errors.images = "At least one image is required";

    const priceNumber = parseInt(formData.price.replace(/[^0-9]/g, ''), 10);
    if (priceNumber < 51000) {
        errors.price = "The minimum price should be ₹51,000";
    }

    return errors;
};

export const formatIndianCurrency = (value) => {
    return parseInt(value).toLocaleString('en-IN');
};

// Sign Up Form Validations
export const validators = {
    fullName: (value) => {
        if (value.length < 3) return "Full name should be at least 3 characters";
        if (value.trim() === '') return "Full name should not be blank";
        return "";
    },

    username: (username) => {
        if (username.length < 3) return "Username must be at least 3 characters long";
        if (username.length > 20) return "Username cannot exceed 20 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
        return "";
    },

    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return "";
    },

    phoneNumber: (phoneNumber) => {
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        if (!phoneRegex.test(phoneNumber)) return "Please enter a valid phone number";
        return "";
    },

    password: (password) => {
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character (!@#$%^&*)";
        return "";
    }
};
