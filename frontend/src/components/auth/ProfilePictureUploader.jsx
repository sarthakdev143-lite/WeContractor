import Image from "next/image";

const ProfilePictureUploader = ({
    preview,
    onFileChange,
    onRemove,
    DEFAULT_PFP,
    fileInputRef
}) => {
    return (
        <div className="relative w-32 h-32 mx-auto mt-4">
            <Image
                src={preview}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover border border-gray-300"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
            />
            {preview !== DEFAULT_PFP && (
                <i
                    onClick={onRemove}
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
                onChange={onFileChange}
                ref={fileInputRef}
                className="hidden"
            />
        </div>
    );
};

export default ProfilePictureUploader;