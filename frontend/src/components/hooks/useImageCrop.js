import { useState } from 'react';

export const useImageCrop = (onCropComplete) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        if (onCropComplete) {
            onCropComplete(croppedArea, croppedAreaPixels);
        }
    };

    return {
        crop,
        setCrop,
        zoom,
        setZoom,
        rotation,
        setRotation,
        croppedAreaPixels,
        handleCropComplete
    };
};
