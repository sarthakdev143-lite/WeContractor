"use client";

import { useRef, useState, useEffect } from "react";
import { MYAXIOS } from "../../../components/Helper";
import { deleteFromCloudinary } from "../../../components/sell/handlers";
import ProfilePictureUploader from "../../../components/auth/ProfilePictureUploader";
import ImageCropModal from "../../../components/auth/ImageCropModal";
import FormInput from "../../../components/auth/FormInput";
import { validators } from "../../../components/sell/utils";
import { useImageCrop } from "../../../components/hooks/useImageCrop";

const DEFAULT_PFP = "/default-avatar.webp";
const SignUp = () => {
    // State management
    const [user, setUser] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        profilePicture: null,
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
                alert("File size should not exceed 5MB");
                resetImageStates();
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file");
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
            alert("Failed to process the image. Please try again.");
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
            alert("Configuration loading... Please try again.");
            return;
        }

        if (!isFormValid()) {
            alert("Please fix all validation errors before submitting.");
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
                    alert("Failed to upload profile picture. Please try again.");
                    setIsLoading(false);
                    return;
                }
            }

            // Prepare request data to match SignupRequest DTO
            const requestData = {
                username: user.username.trim(),
                email: user.email.trim(),
                phoneNumber: user.phoneNumber.trim(),
                password: user.password,
                profilePictureUrl: profilePictureUrl || ""
            };

            console.log("Sending signup request:", requestData);

            // Make the API call
            const response = await MYAXIOS.post("/api/user/signup", requestData);
            console.log("Signup Response:", response.data);

            // Check for successful response based on SignupResponse structure
            if (response.data.success) {
                alert(response.data.message);

                // Reset form
                setUser({
                    username: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    profilePicture: null
                });
                setErrors({
                    username: "",
                    email: "",
                    phoneNumber: "",
                    password: ""
                });
                removeProfilePicture();
            } else {
                throw new Error(response.data.message);
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

            // Handle UserAlreadyExistsException and other errors
            if (error.response) {
                const errorResponse = error.response.data;
                // console.log("Server Error Response:", errorResponse);
                const errorMessage = errorResponse.message;
                
                alert(errorResponse.message);

                // Match error messages with your backend exceptions
                if (errorMessage.includes("Username")) {
                    setErrors(prev => ({ ...prev, username: errorMessage }));
                } else if (errorMessage.includes("Email")) {
                    setErrors(prev => ({ ...prev, email: errorMessage }));
                } else if (errorMessage.includes("Phone number")) {
                    setErrors(prev => ({ ...prev, phoneNumber: errorMessage }));
                } else {
                    alert(`Sign-up failed: ${errorMessage}`);
                }
            } else if (error.request) {
                alert("Network error. Please check your connection and try again.");
            } else {
                alert(`Sign-up failed: ${error.message || "Unknown error occurred"}`);
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
        </section>
    );
};

export default SignUp;