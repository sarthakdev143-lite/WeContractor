export const handleChange = (e, setFormData, formatIndianCurrency) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'price') {
        const numericValue = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        formattedValue = numericValue ? `₹${formatIndianCurrency(numericValue)}` : "";
    } else if (name === 'discount') {
        formattedValue = value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
};
export const handleAmenityToggle = (amenity, setFormData) => {
    setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.includes(amenity)
            ? prev.amenities.filter(a => a !== amenity)
            : [...prev.amenities, amenity]
    }));
};

export const handleTagInput = (e, setFormData) => {
    if (e.key === ' ' && e.target.value.trim()) {
        const newTag = e.target.value.trim();
        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, newTag]
        }));
        e.target.value = '';
    } else if (e.key === 'Backspace' && e.target.value === '') {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.slice(0, -1)
        }));
    }
};

export const removeTag = (tagToRemove, setFormData) => {
    setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
};

export const onDrop = async (acceptedFiles, type, setFormData, setLoading) => {
    try {
        setLoading(true);
        const maxSize = type === 'images' ? 1 * 1024 * 1024 : 5 * 1024 * 1024;
        const filteredFiles = acceptedFiles.filter(file => file.size <= maxSize);

        if (filteredFiles.length < acceptedFiles.length) {
            console.log("Some file(s) exceeded the maximum size limit and were skipped.")
            alert(`Some file(s) exceeded the maximum size limit and were skipped.`);
        }

        const uploadPromises = filteredFiles.map((file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "plot_upload");

            return fetch("https://api.cloudinary.com/v1_1/dgbnelai8/upload", {
                method: "POST",
                body: formData
            }).then(response => response.json());
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        const mediaFiles = uploadedFiles.map(file => ({
            url: file.secure_url,
            public_id: file.public_id
        }));

        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], ...mediaFiles]
        }));

    } catch (error) {
        console.error("Error uploading files: ", error);
    } finally {
        setLoading(false);
    }
};


export const deleteFromCloudinary = async (public_id, type) => {
    try {
        console.log('Attempting to delete file from Cloudinary:', public_id);
        const response = await fetch('/api/deleteFromCloudinary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_id, type }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete file from Cloudinary');
        }

        const result = await response.json();
        console.log('File deleted from Cloudinary:', result);
        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};

export const onRemove = async (index, type, setFormData) => {
    console.log(`Removing file at index ${index} of type ${type}`);
    setFormData(prev => {
        const newFiles = [...prev[type]];
        const removedFile = newFiles[index];

        console.log('File to be removed:', removedFile);

        if (removedFile && removedFile.public_id) {
            console.log('Calling deleteFromCloudinary with public_id:', removedFile.public_id);
            deleteFromCloudinary(removedFile.public_id, type)
                .then(() => console.log('File deleted from Cloudinary'))
                .catch(error => console.error('Error deleting file from Cloudinary:', error));
        } else {
            console.log('No public_id found for the file, skipping Cloudinary deletion');
        }

        newFiles.splice(index, 1);
        console.log('# Updated files array:', newFiles);
        return { ...prev, [type]: newFiles };
    });
};

export const removeFile = (fileType, index, setFormData) => {
    setFormData(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
    }));
};