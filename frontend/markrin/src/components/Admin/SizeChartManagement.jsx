import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaImage } from 'react-icons/fa';
import api, { uploadAPI } from '../../api';
import { toast } from 'sonner';

const SizeChartManagement = () => {
    const [sizeCharts, setSizeCharts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        category: '',
        image_url_cm: '',
        image_url_inch: '',
        measurementDataStr: '{\n  "S": { "chest": 40, "length": 28 },\n  "M": { "chest": 42, "length": 29 },\n  "L": { "chest": 44, "length": 30 },\n  "XL": { "chest": 46, "length": 31 }\n}'
    });

    const [uploadingCm, setUploadingCm] = useState(false);
    const [uploadingInch, setUploadingInch] = useState(false);

    useEffect(() => {
        fetchSizeCharts();
    }, []);

    const fetchSizeCharts = async () => {
        try {
            setLoading(true);
            const res = await api.sizecharts.getAll();
            setSizeCharts(res.data);
        } catch (error) {
            toast.error('Failed to fetch size charts');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Standardize category strings to be lowercase and trimmed
        const processedValue = name === 'category' ? value.toLowerCase().trim() : value;
        setFormData({ ...formData, [name]: processedValue });
    };

    const openModal = (chart = null) => {
        if (chart) {
            setEditingId(chart._id);
            setFormData({
                category: chart.category,
                image_url_cm: chart.image_url_cm || '',
                image_url_inch: chart.image_url_inch || '',
                measurementDataStr: JSON.stringify(chart.measurement_data, null, 2) || '{}'
            });
        } else {
            setEditingId(null);
            setFormData({
                category: '',
                image_url_cm: '',
                image_url_inch: '',
                measurementDataStr: '{\n  "S": { "chest": 40, "length": 28 }\n}'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Invalid file type. Only JPEG, PNG, WebP allowed.');
            return;
        }

        const setUploading = type === 'cm' ? setUploadingCm : setUploadingInch;
        const fieldName = type === 'cm' ? 'image_url_cm' : 'image_url_inch';

        setUploading(true);
        try {
            const result = await uploadAPI.uploadSingle(file);
            setFormData(prev => ({ ...prev, [fieldName]: result.url }));
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Parse JSON
        let parsedData = {};
        try {
            parsedData = JSON.parse(formData.measurementDataStr);
        } catch (err) {
            toast.error('Invalid JSON format for measurements');
            return;
        }

        const payload = {
            category: formData.category,
            image_url_cm: formData.image_url_cm,
            image_url_inch: formData.image_url_inch,
            measurement_data: parsedData
        };

        try {
            if (editingId) {
                await api.sizecharts.update(editingId, payload);
                toast.success('Size chart updated successfully');
            } else {
                await api.sizecharts.create(payload);
                toast.success('Size chart created successfully');
            }
            closeModal();
            fetchSizeCharts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save size chart');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this size chart?')) return;
        try {
            await api.sizecharts.delete(id);
            toast.success('Size chart deleted successfully');
            fetchSizeCharts();
        } catch (error) {
            toast.error('Failed to delete size chart');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Size Chart Management</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-brand-gold text-brand-dark-brown px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                >
                    <FaPlus /> Add Size Chart
                </button>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900/50 text-gray-300 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">CM Image</th>
                                <th className="px-6 py-4 font-medium">Inch Image</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {sizeCharts.map((chart) => (
                                <tr key={chart._id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{chart.category}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{chart.image_url_cm}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{chart.image_url_inch}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => openModal(chart)}
                                                className="text-blue-400 hover:text-blue-300 p-2"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(chart._id)}
                                                className="text-red-400 hover:text-red-300 p-2"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-xl w-full max-w-2xl overflow-hidden border border-gray-700 shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Size Chart' : 'Add Size Chart'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="sizeChartForm" onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category (e.g., sweatshirt, oversized)
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        disabled={!!editingId}
                                        required
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold disabled:opacity-50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            CM Image
                                        </label>
                                        <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'cm')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                disabled={uploadingCm}
                                            />
                                            {uploadingCm ? (
                                                <div className="text-brand-gold animate-pulse">Uploading...</div>
                                            ) : formData.image_url_cm ? (
                                                <div className="space-y-2">
                                                    <img src={formData.image_url_cm} alt="CM Size Chart" className="mx-auto h-20 object-contain" />
                                                    <p className="text-xs text-gray-400">Click or drag to replace</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <FaImage className="mx-auto text-2xl text-gray-500" />
                                                    <p className="text-sm text-gray-400">Click or drag image here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Inch Image
                                        </label>
                                        <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'inch')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                disabled={uploadingInch}
                                            />
                                            {uploadingInch ? (
                                                <div className="text-brand-gold animate-pulse">Uploading...</div>
                                            ) : formData.image_url_inch ? (
                                                <div className="space-y-2">
                                                    <img src={formData.image_url_inch} alt="Inch Size Chart" className="mx-auto h-20 object-contain" />
                                                    <p className="text-xs text-gray-400">Click or drag to replace</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <FaImage className="mx-auto text-2xl text-gray-500" />
                                                    <p className="text-sm text-gray-400">Click or drag image here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Measurement Data (JSON)
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">Example: <code>{`{ "S": { "chest": 40 }, "M": { "chest": 42 } }`}</code></p>
                                    <textarea
                                        name="measurementDataStr"
                                        value={formData.measurementDataStr}
                                        onChange={handleInputChange}
                                        rows="6"
                                        required
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-brand-gold"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-700 flex justify-end gap-4 bg-gray-800/50">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="sizeChartForm"
                                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-brand-gold text-brand-dark-brown hover:bg-yellow-500 transition-colors"
                            >
                                <FaSave className="w-4 h-4" />
                                {editingId ? 'Update Chart' : 'Create Chart'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizeChartManagement;
