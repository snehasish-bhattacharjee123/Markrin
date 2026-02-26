import React, { useState, useRef, useCallback } from 'react';
// import { HiOutlinePhoto, HiOutlineX, HiOutlineArrowUpTray } from 'react-icons/hi2';
import { HiOutlinePhoto } from 'react-icons/hi2/index.js';
import { HiOutlineX } from 'react-icons/hi2/index.js';
import { HiOutlineArrowUpTray } from 'react-icons/hi2/index.js';
import { uploadAPI } from '../../api';
import { toast } from 'sonner';

const ImageUpload = ({
    images = [],
    onImagesChange,
    maxImages = 5,
    maxSizeMB = 5
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const validateFile = (file) => {
        if (!allowedTypes.includes(file.type)) {
            toast.error(`${file.name} is not a supported image type. Use JPEG, PNG, or WebP.`);
            return false;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`${file.name} exceeds ${maxSizeMB}MB limit.`);
            return false;
        }
        return true;
    };

    const uploadFile = async (file, index) => {
        try {
            setUploadProgress(prev => ({ ...prev, [index]: 0 }));
            const result = await uploadAPI.uploadImage(file);
            return result;
        } catch (error) {
            toast.error(`Failed to upload ${file.name}: ${error.message}`);
            throw error;
        } finally {
            setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[index];
                return newProgress;
            });
        }
    };

    const handleFiles = useCallback(async (files) => {
        const fileArray = Array.from(files);
        const remainingSlots = maxImages - images.length;

        if (fileArray.length > remainingSlots) {
            toast.error(`You can only upload ${remainingSlots} more image(s). Maximum ${maxImages} allowed.`);
            return;
        }

        const validFiles = fileArray.filter(validateFile);
        if (validFiles.length === 0) return;

        setUploading(true);

        try {
            const uploadedImages = [];

            for (let i = 0; i < validFiles.length; i++) {
                const file = validFiles[i];
                const result = await uploadFile(file, i);
                uploadedImages.push({
                    url: result.url,
                    publicId: result.publicId,
                    altText: result.altText || file.name,
                });
            }

            onImagesChange([...images, ...uploadedImages]);
            toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    }, [images, maxImages, onImagesChange]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    }, [handleFiles]);

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
        e.target.value = '';
    };

    const handleRemoveImage = async (index) => {
        const imageToRemove = images[index];

        if (imageToRemove.publicId) {
            try {
                await uploadAPI.deleteImage(imageToRemove.publicId);
            } catch (error) {
                console.warn('Failed to delete from Cloudinary:', error);
            }
        }

        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        toast.success('Image removed');
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-lg text-center transition-colors ${isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {uploading ? (
                            <HiOutlineArrowUpTray className="w-8 h-8 text-blue-500 animate-bounce" />
                        ) : (
                            <HiOutlinePhoto className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                        )}
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                            <button
                                type="button"
                                onClick={handleBrowseClick}
                                disabled={uploading || images.length >= maxImages}
                                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Click to upload
                            </button>
                            {' '}or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                            PNG, JPEG or WebP (max. {maxSizeMB}MB per file, {maxImages} images max)
                        </p>
                    </div>

                    {uploading && (
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                    )}
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={image.url}
                                alt={image.altText || `Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {uploadProgress[index] !== undefined && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="text-white text-sm">
                                        {uploadProgress[index]}%
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <HiOutlineX className="w-4 h-4" />
                            </button>

                            {index === 0 && (
                                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && images.length < maxImages && (
                <p className="text-sm text-gray-500">
                    {images.length} of {maxImages} images used
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
