import DOMPurify from 'dompurify';

// Sanitize form data function
export const sanitizeFormData = (formData) => {
    console.log("Sanitizing Form Data...");

    const sanitizeString = (value) => {
        if (typeof value !== 'string') return value;
        const sanitized = DOMPurify.sanitize(value.trim(), {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });
        return sanitized.replace(/\s+/g, ' ').trim();
    };

    const sanitizeNumber = (value) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const cleaned = value.replace(/[^\d.-]/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? '' : num;
        }
        return '';
    };

    const sanitizeArray = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => typeof item === 'string' ? sanitizeString(item) : item).filter(Boolean);
    };

    return {
        title: sanitizeString(formData.title),
        description: sanitizeString(formData.description),
        length: sanitizeNumber(formData.length),
        breadth: sanitizeNumber(formData.breadth),
        location: sanitizeString(formData.location),
        price: sanitizeNumber(formData.price),
        plotType: sanitizeString(formData.plotType),
        discount: sanitizeNumber(formData.discount),
        amenities: sanitizeArray(formData.amenities),
        tags: sanitizeArray(formData.tags),
        images: formData.images.map((img) => img.url),
        videos: formData.videos.map((vid) => vid.url)
    };
};

// Format currency in Indian style
export const formatIndianCurrency = (value) => {
    if (!value) return "0";
    const number = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    return number.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    });
};

// Validate sanitized data
export const validateSanitizedData = (sanitizedData) => {
    const errors = {};

    // Title validation
    if (!sanitizedData.title || sanitizedData.title.length < 5) {
        errors.title = 'Title must be at least 5 characters long';
    } else if (sanitizedData.title.length > 100) {
        errors.title = 'Title cannot exceed 100 characters';
    }

    // Description validation
    if (!sanitizedData.description || sanitizedData.description.length < 20) {
        errors.description = 'Description must be at least 20 characters long';
    } else if (sanitizedData.description.length > 1000) {
        errors.description = 'Description cannot exceed 1000 characters';
    }

    // Length validation
    if (!sanitizedData.length || sanitizedData.length <= 0) {
        errors.length = 'Length must be a positive number greater than 0';
    } else if (sanitizedData.length > 10000) {
        errors.length = 'Length cannot exceed 10,000 feet';
    }

    // Breadth validation
    if (!sanitizedData.breadth || sanitizedData.breadth <= 0) {
        errors.breadth = 'Breadth must be a positive number greater than 0';
    } else if (sanitizedData.breadth > 10000) {
        errors.breadth = 'Breadth cannot exceed 10,000 feet';
    }

    // Location validation
    if (!sanitizedData.location) {
        errors.location = 'Location is required';
    } else if (sanitizedData.location.length < 5) {
        errors.location = 'Location must be at least 5 characters';
    } else if (sanitizedData.location.length > 200) {
        errors.location = 'Location cannot exceed 200 characters';
    }

    // Price validation
    if (!sanitizedData.price || sanitizedData.price <= 0) {
        errors.price = 'Price must be a positive number';
    } else if (sanitizedData.price < 11000) {
        errors.price = `The minimum price should be ₹${formatIndianCurrency(11000)}`;
    } else if (sanitizedData.price > 1000000000) {
        errors.price = 'Price cannot exceed ₹100 crore';
    }

    // Plot type validation
    if (!sanitizedData.plotType) {
        errors.plotType = 'Plot type is required';
    }

    // Discount validation
    if (sanitizedData.discount !== undefined && (sanitizedData.discount < 0 || sanitizedData.discount > 100)) {
        errors.discount = 'Discount must be between 0 and 100';
    }

    // Images validation
    if (!sanitizedData.images || sanitizedData.images.length === 0) {
        errors.images = 'At least one image is required';
    } else if (sanitizedData.images.length > 10) {
        errors.images = 'Cannot upload more than 10 images';
    }

    // Videos validation
    if (sanitizedData.videos && sanitizedData.videos.length > 3) {
        errors.videos = 'Cannot upload more than 3 videos';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
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
