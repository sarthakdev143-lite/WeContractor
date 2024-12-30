import { useState } from 'react';
import { sanitizeFormData, validateSanitizedData } from '@/components/sell/formSanitizer';
import { MYAXIOS } from '@/components/Helper';
import { notify } from '@/components/notifications';

export const useFormState = () => {
    const [formData, setFormData] = useState({
        title: "", description: "", length: "", breadth: "", location: "",
        price: "", plotType: "", discount: "", amenities: [],
        images: [], videos: [], tags: [],
    });

    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedData = sanitizeFormData(formData);
        const { isValid, errors } = validateSanitizedData(sanitizedData);

        if (!isValid) {
            setFormErrors(errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);

        try {
            await MYAXIOS.post('/api/plots', sanitizedData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });

            setFormData({
                title: "", description: "", length: "", breadth: "", location: "",
                price: "", plotType: "", discount: "", amenities: [],
                images: [], videos: [], tags: []
            });

            notify.success("Plot Listed Successfully..");

        } catch (error) {
            console.error("API error:", error);
            setFormErrors({
                apiError: error.response?.data?.message || "An error occurred. Please try again."
            });

        } finally {
            setLoading(false);
            window.scrollTo({ top: 0 });
        }
    };

    return {
        formData,
        setFormData,
        formErrors,
        loading,
        handleSubmit,
        setLoading
    };
};