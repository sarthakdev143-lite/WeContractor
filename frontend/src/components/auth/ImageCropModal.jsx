import Cropper from "react-easy-crop";

const RangeInput = ({ value, min, max, step, onChange, leftIcon, rightIcon }) => (
    <div className="flex items-center space-x-2">
        <i className={`${leftIcon} text-gray-500`} />
        <input
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <i className={`${rightIcon} text-gray-500`} />
    </div>
);

const ImageCropModal = ({ isOpen, imageSource, crop, setCrop, zoom, setZoom, rotation, setRotation, onCropComplete, onClose, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed overflow-auto p-8 pt-60 pb-44 box-border my-8 h-[120%] -top-10 inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
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
                            <label className="text-sm font-medium text-gray-700">Zoom</label>
                            <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                        </div>
                        <RangeInput
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            leftIcon="ri-zoom-out-line"
                            rightIcon="ri-zoom-in-line"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Rotation</label>
                            <span className="text-sm text-gray-500">{rotation}°</span>
                        </div>
                        <RangeInput
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            onChange={(e) => setRotation(parseFloat(e.target.value))}
                            leftIcon="ri-anticlockwise-line"
                            rightIcon="ri-clockwise-line"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;