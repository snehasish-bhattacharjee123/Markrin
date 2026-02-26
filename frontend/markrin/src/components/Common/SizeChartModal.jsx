import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';

const SizeChartModal = ({ isOpen, onClose, sizeChartData }) => {
    const [unit, setUnit] = useState('cm'); // 'cm' or 'inch'

    if (!isOpen) return null;

    const imageUrl = unit === 'cm' ? sizeChartData?.image_url_cm : sizeChartData?.image_url_inch;

    // Measurement data should be a JSON object: { S: { chest: 40, length: 28 }, M: ... }
    const measurements = sizeChartData?.measurement_data || {};
    const sizes = Object.keys(measurements);
    const dimensions = sizes.length > 0 ? Object.keys(measurements[sizes[0]]) : [];

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
                    <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                        {sizeChartData?.category || 'Size'} Chart
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <HiXMark className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col items-center overflow-y-auto bg-gray-50 min-h-[300px]">

                    {/* Toggle cm / inch */}
                    {(sizeChartData?.image_url_cm || sizeChartData?.image_url_inch) && (
                        <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setUnit('cm')}
                                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${unit === 'cm' ? 'bg-white shadow text-brand-dark-brown' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                cm
                            </button>
                            <button
                                onClick={() => setUnit('inch')}
                                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${unit === 'inch' ? 'bg-white shadow text-brand-dark-brown' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                inch
                            </button>
                        </div>
                    )}

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Size Chart"
                            className="max-w-full h-auto object-contain rounded-md shadow-sm"
                        />
                    ) : (
                        sizes.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                <p>No visual size chart available.</p>
                            </div>
                        )
                    )}

                    {sizes.length > 0 && (
                        <div className="mt-8 w-full max-w-xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 font-bold text-gray-700">Size</th>
                                        {dimensions.map(dim => (
                                            <th key={dim} className="px-4 py-3 font-bold text-gray-700 capitalize">{dim}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizes.map((size, index) => (
                                        <tr key={size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3 font-bold text-gray-900 border-r border-gray-100">{size}</td>
                                            {dimensions.map(dim => (
                                                <td key={dim} className="px-4 py-3 text-gray-600">{measurements[size][dim] || '-'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeChartModal;
