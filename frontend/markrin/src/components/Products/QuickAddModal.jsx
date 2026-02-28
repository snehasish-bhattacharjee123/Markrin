import React, { useState, useEffect } from 'react';
import { HiXMark, HiOutlineShoppingBag } from 'react-icons/hi2';
import { productsAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

const QuickAddModal = ({ isOpen, onClose, product, onSuccess, buttonText = "Add to Cart" }) => {
    const { addItem } = useCart();

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        if (!isOpen || !product) {
            setVariants([]);
            setSelectedColor('');
            setSelectedSize('');
            return;
        }

        const fetchVariants = async () => {
            setLoading(true);
            try {
                const variantsData = await productsAPI.getVariants(product._id);
                const vList = variantsData.data || variantsData || [];
                setVariants(vList);

                if (vList.length > 0) {
                    const uniqueColors = [...new Set(vList.map(v => v.color))].filter(Boolean);
                    if (uniqueColors.length > 0) {
                        setSelectedColor(uniqueColors[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to load variants", err);
                toast.error("Could not load product options.");
            } finally {
                setLoading(false);
            }
        };

        fetchVariants();
    }, [isOpen, product]);

    const handleAdd = async () => {
        if (!variants || variants.length === 0) {
            toast.error('This product is currently unavailable.');
            return;
        }

        if (!selectedSize) {
            toast.error('Please select a size first.');
            return;
        }

        const matchedVariant = variants.find(v => v.color === selectedColor && v.size === selectedSize);

        if (!matchedVariant) {
            toast.error('This combination is currently unavailable.');
            return;
        }

        if (matchedVariant.countInStock <= 0) {
            toast.error('This size is out of stock.');
            return;
        }

        setAddingToCart(true);
        try {
            await addItem({
                variant_id: matchedVariant._id,
                quantity: 1,
            });
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setAddingToCart(false);
        }
    };

    if (!isOpen || !product) return null;

    const uniqueColors = [...new Set(variants.map(v => v.color))].filter(Boolean);
    const availableVariants = variants.filter(v => v.color === selectedColor);
    const sizes = [...new Map(availableVariants.map(v => [v.size, v])).values()];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                        <p className="text-sm font-bold text-brand-dark-brown mt-0.5">₹{product.discountPrice || product.basePrice}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 flex-shrink-0 ml-2"
                    >
                        <HiXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin h-8 w-8 border-2 border-brand-dark-brown/30 border-t-brand-dark-brown rounded-full" />
                        </div>
                    ) : variants.length > 0 ? (
                        <div className="space-y-6">
                            {/* Colors */}
                            {uniqueColors.length > 1 && (
                                <div>
                                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                                        Color: <span className="font-bold text-gray-900">{selectedColor}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueColors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    setSelectedSize('');
                                                }}
                                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${selectedColor === color
                                                    ? 'border-brand-dark-brown bg-brand-dark-brown text-white'
                                                    : 'border-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            <div>
                                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Select Size
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((variant) => {
                                        const isSelected = selectedSize === variant.size;
                                        const isOutOfStock = variant.countInStock <= 0;

                                        return (
                                            <button
                                                key={variant.size}
                                                onClick={() => !isOutOfStock && setSelectedSize(variant.size)}
                                                disabled={isOutOfStock}
                                                className={`
                                                    min-w-[48px] h-12 px-3 border rounded-lg text-sm font-bold transition-all
                                                    ${isSelected
                                                        ? 'border-brand-dark-brown bg-brand-dark-brown text-white shadow-md'
                                                        : 'border-gray-200 text-gray-700'}
                                                    ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100 relative' : ''}
                                                `}
                                            >
                                                {variant.size}
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                                        <div className="w-full h-px bg-gray-300 rotate-45 transform origin-center"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">This product is currently unavailable.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={handleAdd}
                        disabled={loading || addingToCart || variants.length === 0}
                        className={`w-full h-12 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-200 flex items-center justify-center gap-2.5 
                            ${(!loading && variants.length > 0)
                                ? 'bg-brand-dark-brown text-white hover:bg-[#2a1810] shadow-md hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {addingToCart ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                            <>
                                <HiOutlineShoppingBag className="w-5 h-5" />
                                {buttonText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickAddModal;
