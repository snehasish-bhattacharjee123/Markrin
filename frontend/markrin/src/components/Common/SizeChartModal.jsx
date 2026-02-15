import React from 'react';
import { HiXMark } from 'react-icons/hi2';

const SizeChartModal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Size Chart</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <HiXMark className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-1 overflow-y-auto bg-gray-50 flex items-center justify-center min-h-[300px]">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Size Chart"
                            className="max-w-full h-auto object-contain rounded-md"
                        />
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <p>No size chart available for this product.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeChartModal;
