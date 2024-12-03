import Image from "next/image";

export const PlotTypeSelector = ({ selectedType, onChange, types, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Plot Type <i>(required)</i></label>
        <div className="mt-2 flex flex-wrap gap-2">
            {types.map((type) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => onChange(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${selectedType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {type}
                </button>
            ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export const AmenitiesSelector = ({ selectedAmenities, onToggle, amenities }) => (
    <div>
        <label title='Services that are easily accessible near your plot.' className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            Amenities <i title='Select the amenities available in your plot' className="ri-information-line ml-1 text-gray-500"></i><i className="ml-1.5">(optional)</i>
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
            {amenities.map((amenity) => (
                <button
                    key={amenity}
                    type="button"
                    onClick={() => onToggle(amenity)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${selectedAmenities.includes(amenity)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {amenity}
                </button>
            ))}
        </div>
    </div>
);

export const TagInput = ({ tags, onKeyDown, onRemove, onPaste }) => (
    <div>
        <label htmlFor="tags" title="Adding tags could help your plot be found easily by buyers." className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            Tags <i title="Tags are the keywords related to your plot" className="ri-information-line ml-1 text-gray-500"></i><i className="ml-1.5">(optional)</i>
        </label>
        <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
            {tags.map((tag, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
                    {tag}
                    <button type="button" onClick={() => onRemove(tag)} className="ml-1 text-indigo-600 hover:text-indigo-800">
                        <i className="ri-close-line"></i>
                    </button>
                </span>
            ))}
            <input
                type="text"
                id="tags"
                className="flex-grow focus:outline-none"
                placeholder="Type and press Space to add tags"
                onKeyDown={onKeyDown}
                onPaste={onPaste}
            />
        </div>
    </div>
);
export const FileUploader = ({ label, files = [], onRemove, getRootProps, getInputProps, iconClass, acceptedFormats }) => {
    const fileType = label.toLowerCase().replace(/s$/, ''); // This will be either 'image' or 'video

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {label === "Images" && <i>(at least 1 required)</i>}
                {label === "Videos" && <i>(optional)</i>}
            </label>
            <div
                {...getRootProps()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
            >
                <div className="space-y-1 text-center">
                    <i className={`${iconClass} mx-auto h-12 w-12 text-gray-400`}></i>
                    <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload {label.toLowerCase()}</span>
                            <input {...getInputProps()} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">{acceptedFormats}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {Array.isArray(files) && files.map((file, index) => (
                    <div key={index} className="relative w-44 mt-4">
                        {file.url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                            <div className="relative w-full pb-[100%] overflow-hidden bg-black rounded-md">
                                <Image
                                    src={file.url}
                                    alt={`preview ${index}`}
                                    className="absolute top-0 left-0 w-full h-full object-contain"
                                    width={1000}
                                    height={600}
                                />
                            </div>
                        ) : (
                            <video
                                src={file.url}
                                className="rounded-md"
                            />
                        )}
                        <button
                            title='Remove'
                            type="button"
                            onClick={() => onRemove(index, fileType)}
                            className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs"
                        >
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SubmitButton = ({ loading }) => (
    <>
        <button
            disabled={loading}
            type="submit"
            className="flex justify-center py-4 px-8 mx-auto border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
            List Your Plot
        </button>
    </>
);