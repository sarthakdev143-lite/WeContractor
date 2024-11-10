'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { fieldConfig, plotTypes, amenitiesList } from '@/components/sell/constants.js';
import { PlotTypeSelector, AmenitiesSelector, TagInput, FileUploader, SubmitButton } from '@/components/sell/formFields.jsx';
import { handleChange, handleAmenityToggle, handleTagInput, removeTag, onDrop, onRemove } from '@/components/sell/handlers.js';
import { validateForm, formatIndianCurrency } from '@/components/sell/utils.js';
import { StatusMessage } from '@/components/sell/StatusMessage.jsx';
import { MYAXIOS } from '@/components/Helper.js';
import withAuth from '@/components/WithAuth.js';
import { TitleField, DescriptionField, LengthField, BreadthField, AreaField, LocationField, PriceField, DiscountField, PricePerSqftField, PriceAfterDiscountField } from './FormFields';

const Sell = () => {
    const [formData, setFormData] = useState({
        title: "", description: "", length: "", breadth: "", location: "",
        price: "", plotType: "", discount: "", amenities: [],
        images: [], videos: [], tags: [],
    });

    const [submitStatus, setSubmitStatus] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'images', setFormData, setLoading),
    });

    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
        accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'videos', setFormData, setLoading),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setSubmitStatus("error");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);

        try {
            const response = await MYAXIOS.post('/api/plots', formData);
            console.log("API response: ", response);
            setSubmitStatus("success");
            setFormErrors({});
            setFormData({
                title: "", description: "", location: "", price: "", plotType: "",
                discount: "", images: [], videos: [], amenities: [], tags: []
            });
        } catch (error) {
            console.error("API error: ", error);
            setSubmitStatus("error");
            setFormErrors({ apiError: error.message });
        } finally {
            setLoading(false);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-screen-xl mx-auto md:p-6 p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">List Your Plot</h2>

            {submitStatus && (
                <StatusMessage status={submitStatus} errors={formErrors} onClose={() => setSubmitStatus(null)} />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-8 max-md:flex-col">
                    <section id="left" className="flex flex-col gap-6 flex-grow md:max-w-[50%]">
                        <TitleField
                            field={fieldConfig.find(f => f.name === 'title')}
                            value={formData.title}
                            onChange={(e) => handleChange(e, setFormData, formatIndianCurrency)}
                            error={formErrors.title}
                        />
                        <DescriptionField
                            field={fieldConfig.find(f => f.name === 'description')}
                            value={formData.description}
                            onChange={(e) => handleChange(e, setFormData, formatIndianCurrency)}
                            error={formErrors.description}
                        />
                        <div className="flex gap-4 flex-wrap">
                            <LengthField
                                field={fieldConfig.find(f => f.name === 'length')}
                                value={formData.length}
                                onChange={(e) => handleChange(e, setFormData, formatIndianCurrency)}
                                error={formErrors.length}
                            />
                            <BreadthField
                                field={fieldConfig.find(f => f.name === 'breadth')}
                                value={formData.breadth}
                                onChange={(e) => handleChange(e, setFormData, formatIndianCurrency)}
                                error={formErrors.breadth}
                            />
                            <AreaField
                                length={formData.length}
                                breadth={formData.breadth}
                            />
                        </div>
                        <LocationField
                            field={fieldConfig.find(f => f.name === 'location')}
                            value={formData.location}
                            onChange={(e) => handleChange(e, setFormData, formatIndianCurrency)}
                            error={formErrors.location}
                        />
                        <div className="flex gap-4 flex-wrap">
                            <PriceField
                                field={fieldConfig.find(f => f.name === 'price')}
                                value={formData.price}
                                onChange={(e) => handleChange(e, setFormData, formatIndianCurrency)}
                                error={formErrors.price}
                            />
                            <PricePerSqftField length={formData.length} breadth={formData.breadth} price={formData.price} />
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <DiscountField
                                field={fieldConfig.find(f => f.name === 'discount')}
                                value={formData.discount}
                                onChange={(e) => handleChange(e, setFormData, formatIndianCurrency)}
                                error={formErrors.discount}
                            />
                            <PriceAfterDiscountField
                                price={formData.price}
                                discount={formData.discount}
                            />
                        </div>
                    </section>

                    <section id="right" className="flex flex-col gap-6 flex-grow md:max-w-[50%]">
                        <PlotTypeSelector
                            selectedType={formData.plotType}
                            onChange={(type) => setFormData(prev => ({ ...prev, plotType: type }))}
                            types={plotTypes}
                            error={formErrors.plotType}
                        />

                        <AmenitiesSelector
                            selectedAmenities={formData.amenities}
                            onToggle={(amenity) => handleAmenityToggle(amenity, setFormData)}
                            amenities={amenitiesList}
                        />

                        <TagInput
                            tags={formData.tags}
                            onKeyDown={(e) => handleTagInput(e, setFormData)}
                            onRemove={(tag) => removeTag(tag, setFormData)}
                        />

                        <FileUploader
                            label="Images"
                            accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] }}
                            files={formData.images}
                            onDrop={(acceptedFiles) => onDrop(acceptedFiles, 'images', setFormData, setLoading)}
                            onRemove={(index) => onRemove(index, 'images', setFormData)}
                            getRootProps={getImageRootProps}
                            getInputProps={getImageInputProps}
                            iconClass="ri-image-add-line"
                            acceptedFormats="PNG, JPG, GIF up to 1MB"
                        />

                        <FileUploader
                            label="Videos"
                            accept={{ 'video/*': ['.mp4', '.mov', '.avi'] }}
                            files={formData.videos}
                            onDrop={(acceptedFiles) => onDrop(acceptedFiles, 'videos', setFormData, setLoading)}
                            onRemove={(index) => onRemove(index, 'videos', setFormData)}
                            getRootProps={getVideoRootProps}
                            getInputProps={getVideoInputProps}
                            iconClass="ri-video-add-line"
                            acceptedFormats="MP4, MOV up to 5MB"
                        />
                        

                        {loading && (
                            <div className="loading-skeleton flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="ml-2">Uploading...</span>
                            </div>
                        )}
                    </section>
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}

export default withAuth(Sell);