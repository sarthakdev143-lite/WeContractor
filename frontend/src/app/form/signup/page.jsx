"use client";

import { useState, useRef } from "react";
import { MYAXIOS } from "../../../components/Helper";
import Cropper from "react-easy-crop";

const DEFAULT_PFP = "/default-avatar.webp";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dgbnelai8/upload";
const UPLOAD_PRESET = "user_pfp_upload";

const SignUp = () => {
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
    const fileInputRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Image cropping states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSource, setImageSource] = useState(null);
    const [originalPFPname, setOriginalPFPname] = useState("");

    // Validation rules
    const validateUsername = (username) => {
        if (username.length < 3) {
            return "Username must be at least 3 characters long";
        }
        if (username.length > 20) {
            return "Username cannot exceed 20 characters";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return "Username can only contain letters, numbers, and underscores";
        }
        return "";
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        return "";
    };

    const validatePhoneNumber = (phoneNumber) => {
        // This regex allows for different phone number formats
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return "Please enter a valid phone number";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return "Password must contain at least one special character (!@#$%^&*)";
        }
        return "";
    };

    const validateField = (name, value) => {
        switch (name) {
            case "username":
                return validateUsername(value);
            case "email":
                return validateEmail(value);
            case "phoneNumber":
                return validatePhoneNumber(value);
            case "password":
                return validatePassword(value);
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Validate on change
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Function to check if the form is valid
    const isFormValid = () => {
        console.log("Checking form validity...");
        const newErrors = {
            username: validateField("username", user.username),
            email: validateField("email", user.email),
            phoneNumber: validateField("phoneNumber", user.phoneNumber),
            password: validateField("password", user.password),
        };

        console.log("New errors:", newErrors);

        setErrors(newErrors);

        const isValid = !Object.values(newErrors).some(error => error !== "");
        console.log("Form validity:", isValid);
        return isValid;
    };

    const resetCropStates = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setImageSource(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log("File selected:", file);

        if (file) {
            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size should not exceed 5MB");
                console.log("File size exceeded:", file.size);
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file");
                console.log("Invalid file type:", file.type);
                return;
            }

            setOriginalPFPname(file.name);
            console.log("Original profile picture name set to:", file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSource(reader.result);
                setIsModalOpen(true);
                console.log("Image source set and modal opened");
            };
            reader.readAsDataURL(file);
            console.log("File reading started");
        } else {
            console.log("No file selected");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        resetCropStates();
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

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
            console.error(e);
            return null;
        }
    };

    const handleCropSave = async () => {
        const croppedImage = await getCroppedImage();
        if (croppedImage) {
            const croppedImageUrl = URL.createObjectURL(croppedImage);
            setPreview(croppedImageUrl);
            setUser((prevState) => ({
                ...prevState,
                profilePicture: croppedImage,
            }));
        }
        handleModalClose();
    };

    const removeProfilePicture = () => {
        setUser((prevState) => ({
            ...prevState,
            profilePicture: null,
        }));
        setPreview(DEFAULT_PFP);
        resetCropStates();
    };

    const uploadImageToCloudinary = async (imageFile) => {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            console.log("Uploading image to Cloudinary...");
            const response = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log("Image upload successful. Secure URL:", data.secure_url);
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload failed", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted:", user);

        if (!isFormValid()) {
            alert("Please fix all validation errors before submitting.");
            console.log("Validation errors:", errors);
            return;
        }

        setIsLoading(true);

        try {
            let profilePictureUrl = "";
            if (user.profilePicture) {
                profilePictureUrl = await uploadImageToCloudinary(user.profilePicture);
                console.log("Profile picture uploaded to Cloudinary:", profilePictureUrl);
            }

            const formData = new FormData();
            formData.append("username", user.username);
            formData.append("email", user.email);
            formData.append("phoneNumber", user.phoneNumber);
            formData.append("profilePictureUrl", profilePictureUrl);
            formData.append("password", user.password);
            console.log("Form data:", formData.get("username"), formData.get("email"), formData.get("phoneNumber"), formData.get("profilePictureUrl"), formData.get("password"));

            console.log("Sign-up API response : ",
                await MYAXIOS.post("/api/user/signup", formData, {
                    headers: { "Content-Type": "application/json" },
                })
            );

            alert("User signed up successfully!");
            setUser({
                username: "",
                email: "",
                phoneNumber: "",
                password: "",
                profilePicture: null,
            });

            setErrors({
                username: "",
                email: "",
                phoneNumber: "",
                password: "",
            });
        } catch (error) {
            console.error("Sign-up API error:", error);
            alert("Sign-up failed!\nReason : " + error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };


    // Helper function to determine input field classes based on validation state
    const getInputClassName = (fieldName) => {
        const baseClasses = "w-full px-4 py-2 border rounded-lg transition-colors duration-200 outline-none";
        if (errors[fieldName]) {
            return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
        }
        if (user[fieldName] && !errors[fieldName]) {
            return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500`;
        }
        return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
    };

    return (
        <section className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile Picture Section */}
                <div className="relative w-32 h-32 mx-auto">
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full rounded-full object-cover border border-gray-300"
                    />
                    {user.profilePicture && (
                        <i
                            onClick={removeProfilePicture}
                            className="ri-close-line text-white absolute bottom-1 left-1 flex justify-center items-center bg-red-600 w-7 h-7 rounded-full cursor-pointer hover:bg-red-700 transition-colors duration-200"
                        />
                    )}
                    <i
                        onClick={() => fileInputRef.current.click()}
                        className="ri-image-add-line text-white absolute bottom-1 right-1 flex justify-center items-center bg-blue-600 w-7 h-7 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Username Field */}
                    <div className="space-y-1">
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className={getInputClassName("username")}
                            required
                            disabled={isLoading}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm">{errors.username}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={getInputClassName("email")}
                            required
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-1">
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className={getInputClassName("phoneNumber")}
                            required
                            minLength={10}
                            maxLength={10}
                            disabled={isLoading}
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className={`${getInputClassName("password")} pr-10`}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <i className={`ri-${showPassword ? 'eye-line' : 'eye-off-line'}`} />
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
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

            {isModalOpen && (
                <div className="fixed overflow-auto p-8 pt-16 my-8 -top-5 inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl max-w-[600px] w-full">
                        <div className="relative h-[400px] w-full bg-gray-50">
                            <Cropper
                                image={imageSource}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                                cropShape="round"
                                showGrid={true}
                                className="!rounded-none"
                            />
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">
                                        Zoom
                                    </label>
                                    <span className="text-sm text-gray-500">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="ri-zoom-out-line text-gray-500" />
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <i className="ri-zoom-in-line text-gray-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">
                                        Rotation
                                    </label>
                                    <span className="text-sm text-gray-500">
                                        {rotation}°
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="ri-anticlockwise-line text-gray-500" />
                                    <input
                                        type="range"
                                        value={rotation}
                                        min={0}
                                        max={360}
                                        step={1}
                                        onChange={(e) => setRotation(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <i className="ri-clockwise-line text-gray-500" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCropSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SignUp;