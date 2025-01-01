'use client';

import React, { useState, Suspense } from 'react';
import { useDropzone } from 'react-dropzone';
import { fieldConfig, plotTypes, amenitiesList } from '@/components/sell/constants.js';
import { PlotTypeSelector, AmenitiesSelector, TagInput, SubmitButton } from '@/components/sell/formFields.jsx';
import { handleChange, handleAmenityToggle, handleTagInput, removeTag, onDrop, onRemove } from '@/components/sell/handlers.js';
import { formatIndianCurrency } from '@/components/sell/utils.js';
import { StatusMessage } from '@/components/sell/StatusMessage.jsx';
import withAuth from '@/components/WithAuth.js';
import { TitleField, DescriptionField, LengthField, BreadthField, AreaField, LocationField, PriceField, DiscountField, PricePerSqftField, PriceAfterDiscountField } from './FormFields';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { useFormState } from '@/components/hooks/useFormState';

// Fix 1: Correct dynamic import syntax
const FileUploader = dynamic(() =>
    import('@/components/sell/formFields').then(mod => mod.FileUploader), {
    suspense: true,
    loading: () => <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
});

const FormSkeleton = () => (
    <div className="max-w-screen-xl mx-auto p-4 bg-white rounded-xl shadow-lg animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="flex gap-8 max-md:flex-col">
            <div className="flex-1 space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
            <div className="flex-1 space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    </div>
);

const Sell = () => {
    const { formData, setFormData, formErrors, loading, handleSubmit, setLoading } = useFormState();
    const [submitStatus, setSubmitStatus] = useState(null);

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'images', setFormData, setLoading),
    });

    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
        accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'videos', setFormData, setLoading),
    });

    // Fix 2: Wrap FileUploader components in error boundary
    const renderFileUploader = (props) => {
        try {
            return (
                <Suspense fallback={<div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>}>
                    <FileUploader {...props} />
                </Suspense>
            );
        } catch (error) {
            console.error('Error rendering FileUploader:', error);
            return <div>Error loading file uploader</div>;
        }
    };

    return (
        <Suspense fallback={<FormSkeleton />}>
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
                                <PricePerSqftField
                                    length={formData.length}
                                    breadth={formData.breadth}
                                    price={formData.price}
                                    discount={formData.discount}
                                />
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
                                onPaste={(e) => handleTagInput(e, setFormData)}
                                onRemove={(tag) => removeTag(tag, setFormData)}
                            />

                            {renderFileUploader({
                                accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
                                label: "Images",
                                files: formData.images,
                                onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'images', setFormData, setLoading),
                                onRemove: (index) => onRemove(index, 'images', setFormData),
                                getRootProps: getImageRootProps,
                                getInputProps: getImageInputProps,
                                iconClass: "ri-image-add-line",
                                acceptedFormats: "PNG, JPG, GIF up to 1MB"
                            })}

                            {renderFileUploader({
                                accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
                                label: "Videos",
                                files: formData.videos,
                                onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'videos', setFormData, setLoading),
                                onRemove: (index) => onRemove(index, 'videos', setFormData),
                                getRootProps: getVideoRootProps,
                                getInputProps: getVideoInputProps,
                                iconClass: "ri-video-add-line",
                                acceptedFormats: "MP4, MOV up to 5MB"
                            })}
                        </section>
                    </div>

                    <SubmitButton loading={loading} />
                </form>

                <ToastContainer
                    position="top-right"
                    autoClose={10000}
                    limit={3}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                            <span>Processing...</span>
                        </div>
                    </div>
                </div>
            )}
        </Suspense>
    );
};

export default withAuth(Sell);