import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, adminAPI, uploadAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlinePhoto, HiOutlineCloudArrowUp, HiXMark } from 'react-icons/hi2';
import { getThumbnailUrl } from '../../utils/cloudinaryHelper';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        countInStock: '',
        sku: '',
        category: '',
        brand: '',
        sizes: [],
        colors: [],
        collections: '',
        material: '',
        gender: 'Unisex',
        images: [],
        isFeatured: false,
        isNewArrival: false,
        tags: '',
        dimensions: { length: '', width: '', height: '' },
        weight: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
    });

    // Image upload state
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const { isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const categories = ['Topwear', 'Bottomwear'];
    const genders = ['Men', 'Women', 'Unisex'];
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const availableColors = ['Black'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productsAPI.getAll();
            // Handle various response structures defensively
            const list = data?.products || (Array.isArray(data) ? data : []);
            setProducts(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Fetch products error:', err);
            toast.error(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleColorToggle = (color) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color]
        }));
    };

    const handleDimensionsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            dimensions: {
                ...prev.dimensions,
                [name]: value
            }
        }));
    };

    // ============================================================
    // DRAG & DROP IMAGE UPLOAD
    // ============================================================
    const handleFiles = useCallback(async (files) => {
        const validFiles = Array.from(files).filter(file => {
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                toast.error(`${file.name}: Invalid file type. Only JPEG, PNG, WebP allowed.`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name}: File too large. Max 5MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const uploaded = [];
            for (let i = 0; i < validFiles.length; i++) {
                const result = await uploadAPI.uploadSingle(validFiles[i]);
                uploaded.push({
                    url: result.url,
                    altText: validFiles[i].name.split('.')[0],
                    publicId: result.publicId,
                });
                setUploadProgress(Math.round(((i + 1) / validFiles.length) * 100));
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploaded],
            }));
            toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded successfully`);
        } catch (err) {
            toast.error(err.message || 'Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleFileInputChange = (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
        // Reset input so the same file can be selected again
        e.target.value = '';
    };

    const removeImage = async (index) => {
        const image = formData.images[index];
        // Try to delete from Cloudinary if we have a publicId
        if (image.publicId) {
            try {
                await uploadAPI.deleteImage(image.publicId);
            } catch (err) {
                // Don't block removal from form if Cloudinary delete fails
                console.warn('Failed to delete from Cloudinary:', err);
            }
        }
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const reorderImages = (fromIndex, toIndex) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            const [moved] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, moved);
            return { ...prev, images: newImages };
        });
    };

    // ============================================================
    // MODAL
    // ============================================================
    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                discountPrice: product.discountPrice || '',
                countInStock: product.countInStock || '',
                sku: product.sku || '',
                category: product.category || '',
                brand: product.brand || '',
                sizes: product.sizes || [],
                colors: product.colors || [],
                collections: product.collections || '',
                material: product.material || '',
                gender: product.gender || 'Unisex',
                images: product.images?.length ? product.images : [],
                isFeatured: product.isFeatured || false,
                isNewArrival: product.isNewArrival || false,
                tags: product.tags ? product.tags.join(', ') : '',
                dimensions: {
                    length: product.dimensions?.length || '',
                    width: product.dimensions?.width || '',
                    height: product.dimensions?.height || '',
                },
                weight: product.weight || '',
                metaTitle: product.metaTitle || '',
                metaDescription: product.metaDescription || '',
                metaKeywords: product.metaKeywords || '',
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                discountPrice: '',
                countInStock: '',
                sku: '',
                category: '',
                brand: '',
                sizes: [],
                colors: [],
                collections: '',
                material: '',
                gender: 'Unisex',
                images: [],
                isFeatured: false,
                isNewArrival: false,
                tags: '',
                dimensions: { length: '', width: '', height: '' },
                weight: '',
                metaTitle: '',
                metaDescription: '',
                metaKeywords: '',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                discountPrice: parseFloat(formData.discountPrice) || 0,
                countInStock: parseInt(formData.countInStock) || 0,
                weight: parseFloat(formData.weight) || 0,
                dimensions: {
                    length: parseFloat(formData.dimensions.length) || 0,
                    width: parseFloat(formData.dimensions.width) || 0,
                    height: parseFloat(formData.dimensions.height) || 0,
                },
                tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                images: Array.isArray(formData.images) ? formData.images.filter(img => img && img.url).map(img => ({
                    url: img.url,
                    altText: img.altText || '',
                })) : [],
            };

            console.log('Submitting Product Data:', productData);

            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct._id, productData);
                toast.success('Product updated successfully');
            } else {
                await adminAPI.createProduct(productData);
                toast.success('Product created successfully');
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await adminAPI.deleteProduct(id);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                    <p className="text-gray-500">{products.length} products total</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <HiOutlinePlus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="relative h-48">
                            <img
                                src={getThumbnailUrl(product.images?.[0]?.url) || 'https://via.placeholder.com/300x200'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.isFeatured && (
                                <span className="absolute top-2 left-2 px-2 py-1 bg-brand-gold text-xs font-bold rounded">
                                    Featured
                                </span>
                            )}
                            {product.isNewArrival && (
                                <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                    New
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                            <p className="text-[10px] text-brand-gold font-mono mt-1 truncate">Slug: {product.slug}</p>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-lg font-bold text-brand-gold">
                                    ₹{product.price?.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-400">
                                    Stock: {product.countInStock}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => openModal(product)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                    <HiOutlinePencil className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl">
                    <HiOutlinePhoto className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600">No products yet</h3>
                    <p className="text-gray-400 mb-4">Add your first product to get started</p>
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Product
                    </button>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL */}
            {/* ============================================================ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
                            <h3 className="text-xl font-bold">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* ============ DRAG & DROP IMAGE UPLOADER ============ */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-800 border-b pb-2">Product Images</h4>

                                {/* Drop Zone */}
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragOver
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        multiple
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />

                                    {uploading ? (
                                        <div className="space-y-3">
                                            <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full mx-auto" />
                                            <p className="text-sm text-gray-500">Uploading to Cloudinary... {uploadProgress}%</p>
                                            <div className="w-48 mx-auto bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <HiOutlineCloudArrowUp className={`w-12 h-12 mx-auto mb-3 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                                            <p className="text-sm font-medium text-gray-700">
                                                {isDragOver ? 'Drop images here!' : 'Drag & drop images here'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                or click to browse • JPEG, PNG, WebP • Max 5MB each
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Uploaded Images Preview */}
                                {formData.images.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 font-medium">
                                            {formData.images.length} image{formData.images.length > 1 ? 's' : ''} • Drag to reorder • First image is the main product image
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {formData.images.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${index === 0 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                                                        }`}
                                                >
                                                    <img
                                                        src={getThumbnailUrl(img.url) || img.url}
                                                        alt={img.altText || `Image ${index + 1}`}
                                                        className="w-full aspect-square object-cover"
                                                    />

                                                    {/* Main badge */}
                                                    {index === 0 && (
                                                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                                                            MAIN
                                                        </span>
                                                    )}

                                                    {/* Controls overlay */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => reorderImages(index, 0)}
                                                                className="p-1.5 bg-white rounded-lg text-blue-600 text-xs font-bold hover:bg-blue-50"
                                                                title="Set as main image"
                                                            >
                                                                ★
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="p-1.5 bg-white rounded-lg text-red-600 hover:bg-red-50"
                                                            title="Remove image"
                                                        >
                                                            <HiXMark className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Alt text input */}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5">
                                                        <input
                                                            type="text"
                                                            value={img.altText || ''}
                                                            onChange={(e) => {
                                                                const newImages = [...formData.images];
                                                                newImages[index] = { ...newImages[index], altText: e.target.value };
                                                                setFormData(prev => ({ ...prev, images: newImages }));
                                                            }}
                                                            placeholder="Alt text..."
                                                            className="w-full bg-transparent text-white text-[10px] border-none outline-none placeholder-gray-300"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Identity & Basic Info */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-800 border-b pb-2">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    {editingProduct && (
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Product Slug (Auto-generated)</label>
                                            <div className="p-2 bg-gray-50 border rounded-md text-sm text-gray-500 font-mono">
                                                {editingProduct.slug}
                                            </div>
                                        </div>
                                    )}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Inventory */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-800 border-b pb-2">Pricing & Inventory</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                                        <input
                                            type="number"
                                            name="discountPrice"
                                            value={formData.discountPrice}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock *</label>
                                        <input
                                            type="number"
                                            name="countInStock"
                                            value={formData.countInStock}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-800 border-b pb-2">Classification</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Collections *</label>
                                        <input
                                            type="text"
                                            name="collections"
                                            value={formData.collections}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        >
                                            {genders.map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                        <input
                                            type="text"
                                            name="material"
                                            value={formData.material}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            placeholder="T-Shirt, Summer, Sale"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Physical & SEO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-800 border-b pb-2">Dimensions & Weight</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Length</label>
                                            <input type="number" name="length" value={formData.dimensions.length} onChange={handleDimensionsChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Width</label>
                                            <input type="number" name="width" value={formData.dimensions.width} onChange={handleDimensionsChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Height</label>
                                            <input type="number" name="height" value={formData.dimensions.height} onChange={handleDimensionsChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} step="0.01" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-800 border-b pb-2">SEO Fields</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                        <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                        <input type="text" name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                                        <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleSizeToggle(size)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${formData.sizes.includes(size)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableColors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleColorToggle(color)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${formData.colors.includes(color)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Flags */}
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                    <span className="text-sm text-gray-700">Featured Product</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                    <span className="text-sm text-gray-700">New Arrival</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
