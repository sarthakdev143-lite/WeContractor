import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut, RotateCcw, RotateCw } from 'lucide-react';

const ImageCropModal = ({ isOpen, imageSource, crop, setCrop, zoom, setZoom, rotation, setRotation, onCropComplete, onClose, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Image</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative w-full bg-gray-50 h-[300px]">
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

                {/* Controls */}
                <div className="p-6 space-y-6">
                    {/* Zoom Control */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Zoom</label>
                            <span className="text-sm font-medium text-gray-500">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ZoomOut className="w-4 h-4 text-gray-500" />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <ZoomIn className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Rotation Control */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Rotation</label>
                            <span className="text-sm font-medium text-gray-500">{rotation}°</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <RotateCcw className="w-4 h-4 text-gray-500" />
                            <input
                                type="range"
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                onChange={(e) => setRotation(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <RotateCw className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse gap-3 pt-6 border-t sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 w-full sm:w-auto text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            className="px-4 py-2.5 w-full sm:w-auto text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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