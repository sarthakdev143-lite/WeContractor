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