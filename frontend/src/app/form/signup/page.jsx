"use client";

import { useRef, useState, useEffect } from "react";
import { MYAXIOS } from "../../../components/Helper";
import { deleteFromCloudinary } from "../../../components/sell/handlers";
import ProfilePictureUploader from "../../../components/auth/ProfilePictureUploader";
import ImageCropModal from "../../../components/auth/ImageCropModal";
import FormInput from "../../../components/auth/FormInput";
import { validators } from "../../../components/sell/utils";
import { useImageCrop } from "../../../components/hooks/useImageCrop";
import { ToastContainer } from 'react-toastify';
import { notify } from '../../../components/notifications';
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_PFP = "/default-avatar.webp";

// Error handling utility functions
const handleValidationErrors = (errorData, setErrors) => {
    const newErrors = {};

    // Handle array of errors
    if (Array.isArray(errorData.errors)) {
        errorData.errors.forEach(error => {
            if (error.field) {
                newErrors[error.field] = error.message;
                notify.error(`${error.field}: ${error.message}`);
            }
        });
    }
    // Handle object of errors
    else if (errorData.errors && typeof errorData.errors === 'object') {
        Object.entries(errorData.errors).forEach(([field, message]) => {
            newErrors[field] = message;
            notify.error(`${field}: ${message}`);
        });
    }
    // Handle single error message
    else if (errorData.message) {
        const field = determineErrorField(errorData.message);
        if (field) {
            newErrors[field] = errorData.message;
        }
        notify.error(errorData.message);
    }

    setErrors(prev => ({
        ...prev,
        ...newErrors
    }));
};

const determineErrorField = (errorMessage) => {
    const errorMessage_lower = errorMessage.toLowerCase();
    if (errorMessage_lower.includes('username')) return 'username';
    if (errorMessage_lower.includes('email')) return 'email';
    if (errorMessage_lower.includes('phone')) return 'phoneNumber';
    if (errorMessage_lower.includes('password')) return 'password';
    return null;
};

const SignUp = () => {
    // State management
    const [user, setUser] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        profilePicture: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
    });

    const [preview, setPreview] = useState(DEFAULT_PFP);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSource, setImageSource] = useState(null);
    const [originalPFPname, setOriginalPFPname] = useState("");
    const [cloudinaryConfig, setCloudinaryConfig] = useState(null);

    const fileInputRef = useRef(null);

    // Reset all image-related states
    const resetImageStates = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setImageSource(null);
        setOriginalPFPname("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
    };

    // Custom hook for image cropping
    const {
        crop,
        setCrop,
        zoom,
        setZoom,
        rotation,
        setRotation,
        croppedAreaPixels,
        handleCropComplete
    } = useImageCrop();

    // Form validation helper
    const validateField = (name, value) => {
        if (validators[name]) {
            return validators[name](value);
        }
        return "";
    };

    // Form field change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value,
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Form validation
    const isFormValid = () => {
        const newErrors = {
            username: validateField("username", user.username),
            email: validateField("email", user.email),
            phoneNumber: validateField("phoneNumber", user.phoneNumber),
            password: validateField("password", user.password),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    };

    // Image handling methods
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });

    const getCroppedImage = async () => {
        try {
            const image = await createImage(imageSource);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const maxSize = Math.max(image.width, image.height);
            canvas.width = maxSize;
            canvas.height = maxSize;

            ctx.translate(maxSize / 2, maxSize / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-maxSize / 2, -maxSize / 2);

            ctx.drawImage(
                image,
                maxSize / 2 - image.width / 2,
                maxSize / 2 - image.height / 2
            );

            const data = ctx.getImageData(0, 0, maxSize, maxSize);
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.putImageData(
                data,
                Math.round(0 - maxSize / 2 + image.width / 2 - croppedAreaPixels.x),
                Math.round(0 - maxSize / 2 + image.height / 2 - croppedAreaPixels.y)
            );

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    const PFP_WithOriginalName = new File([blob], originalPFPname, {
                        type: "image/jpeg",
                    });
                    resolve(PFP_WithOriginalName);
                }, "image/jpeg");
            });
        } catch (e) {
            console.error("Error creating cropped image:", e);
            return null;
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log("File selected:", file);

        if (file) {
            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                notify.warning("File size should not exceed 5MB");
                resetImageStates();
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                notify.error("Please upload an image file");
                resetImageStates();
                return;
            }

            setOriginalPFPname(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSource(reader.result);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Modified remove profile picture handler
    const removeProfilePicture = () => {
        setUser(prev => ({
            ...prev,
            profilePicture: null,
        }));
        setPreview(DEFAULT_PFP);
        resetImageStates();
    };

    // Modified crop save handler
    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImage();
            if (croppedImage) {
                const croppedImageUrl = URL.createObjectURL(croppedImage);
                setPreview(croppedImageUrl);
                setUser(prev => ({
                    ...prev,
                    profilePicture: croppedImage,
                }));
            }
        } catch (error) {
            console.error("Error saving cropped image:", error);
            notify("Failed to process the image. Please try again.");
        } finally {
            setIsModalOpen(false);
        }
    };

    // Modified modal close handler
    const handleModalClose = () => {
        setIsModalOpen(false);
        if (preview === DEFAULT_PFP) {
            resetImageStates();
        }
    };

    useEffect(() => {
        fetch('/api/cloudinary/config')
            .then(res => res.json())
            .then(data => setCloudinaryConfig(data))
            .catch(err => console.error('Error fetching Cloudinary config:', err));
    }, []);

    // Cloudinary upload
    const uploadImageToCloudinary = async (imageFile) => {
        if (!cloudinaryConfig) {
            throw new Error('Cloudinary configuration not loaded');
        }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", cloudinaryConfig.uploadPreset);

        try {
            const response = await fetch(cloudinaryConfig.cloudinaryUrl, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cloudinaryConfig) {
            notify.warning("Configuration loading... Please try again.");
            return;
        }

        if (!isFormValid()) {
            notify.error("Please fix all validation errors before submitting.");
            return;
        }

        setIsLoading(true);
        let profilePictureUrl = "";

        try {
            // Upload image to Cloudinary if exists
            if (user.profilePicture) {
                try {
                    profilePictureUrl = await uploadImageToCloudinary(user.profilePicture);
                } catch (error) {
                    console.error("Failed to upload image:", error);
                    notify.error("Failed to upload profile picture. Please try again.");
                    setIsLoading(false);
                    return;
                }
            }

            const requestData = {
                profilePicture: profilePictureUrl || "",
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                password: user.password
            };

            console.log("Request Data:", JSON.stringify(requestData, null, 2));
            try {
                const response = await MYAXIOS.post("/api/auth/signup", requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    notify.success(response.data.message || "Email verification link sent!");

                    // Reset form
                    setUser({ username: "", email: "", phoneNumber: "", password: "", profilePicture: "" });
                    setErrors({ username: "", email: "", phoneNumber: "", password: "" });
                    removeProfilePicture();
                } else {
                    // Handle "successful" request with error in response data
                    handleValidationErrors(response.data, setErrors);
                }

            } catch (error) {
                if (error.response) {
                    // Log detailed error information
                    console.log("Error Status:", error.response.status);
                    console.log("Error Headers:", error.response.headers);
                    console.log("Error Data:", error.response.data);
                    console.log("Request Data:", error.response.config.data);
                }
                throw error;
            }

        } catch (error) {
            console.error("Signup Error:", error);

            // Clean up Cloudinary image if signup failed
            if (profilePictureUrl) {
                try {
                    await deleteFromCloudinary(
                        profilePictureUrl.split('/').pop().split('.')[0],
                        "image"
                    );
                } catch (cleanupError) {
                    console.error("Failed to cleanup uploaded image:", cleanupError);
                }
            }

            // Handle different types of errors
            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;

                console.log("Handling Error For Code : " + status + " & data : " + errorData);

                switch (status) {
                    case 400:
                        // Bad Request - Validation errors
                        handleValidationErrors(errorData, setErrors);
                        break;

                    case 401:
                        // Unauthorized
                        notify.error("Authentication failed. Please try again.");
                        break;

                    case 403:
                        // Forbidden
                        notify.error("You don't have permission to perform this action.");
                        break;

                    case 409:
                        // Conflict - Duplicate entry
                        handleValidationErrors(errorData, setErrors);
                        break;

                    case 422:
                        // Unprocessable Entity - Validation errors
                        handleValidationErrors(errorData, setErrors);
                        break;

                    case 429:
                        // Too Many Requests
                        notify.error("Too many attempts. Please try again later.");
                        break;

                    case 500:
                        // Server Error
                        notify.error("Server error. Please try again later.");
                        break;

                    default:
                        notify.error(errorData.message || "An unexpected error occurred. Please try again.");
                }
            } else if (error.request) {
                // Network Error
                notify.error("Network error. Please check your connection and try again.");
            } else {
                // Other Errors
                notify.error(`Sign-up failed: ${error.message || "Unknown error occurred"}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <ProfilePictureUploader
                    preview={preview}
                    onFileChange={handleFileChange}
                    onRemove={removeProfilePicture}
                    DEFAULT_PFP={DEFAULT_PFP}
                    fileInputRef={fileInputRef}
                />

                <div className="space-y-4">
                    <FormInput
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        placeholder="Username"
                        error={errors.username}
                        isLoading={isLoading}
                    />

                    <FormInput
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Email"
                        error={errors.email}
                        isLoading={isLoading}
                    />

                    <FormInput
                        type="tel"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        error={errors.phoneNumber}
                        isLoading={isLoading}
                        minLength={10}
                        maxLength={10}
                    />

                    <FormInput
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Password"
                        error={errors.password}
                        isLoading={isLoading}
                        showPasswordToggle={true}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || Object.values(errors).some(error => error !== "")}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin mr-2" />
                            Signing Up...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </form>
            <ImageCropModal
                isOpen={isModalOpen}
                imageSource={imageSource}
                crop={crop}
                setCrop={setCrop}
                zoom={zoom}
                setZoom={setZoom}
                rotation={rotation}
                setRotation={setRotation}
                onCropComplete={handleCropComplete}
                onClose={handleModalClose}
                onSave={handleCropSave}
            />
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
        </section>
    );
};

export default SignUp;