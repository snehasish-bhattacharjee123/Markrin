import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineTrash } from "react-icons/hi2";
import { wishlistAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

import { useWishlist } from "../context/WishlistContext";
import { RiDeleteBinLine } from 'react-icons/ri';

const Wishlist = () => {
    const { wishlistCount, removeFromWishlist: contextRemove } = useWishlist();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();

    // Popup state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");

    const ITEMS_PER_PAGE = 8;

    const fetchWishlist = async (page = 1) => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await wishlistAPI.get(page, ITEMS_PER_PAGE);
            setWishlist(data.products || []);
            setTotalPages(data.pages || 1);
            setTotal(data.total || 0);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist(1);
    }, [isAuthenticated]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await contextRemove(productId);
            // After context update, refresh local paginated list
            fetchWishlist(currentPage);
        } catch (err) {
            console.error("Error removing from wishlist:", err);
        }
    };

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setSelectedSize("");
    };

    const confirmAddToCart = async () => {
        if (!selectedProduct) return;

        // If product has sizes but none selected
        if (selectedProduct.sizes?.length > 0 && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        await addItem({
            productId: selectedProduct._id,
            quantity: 1,
            size: selectedSize || selectedProduct.sizes?.[0]
        });

        setSelectedProduct(null);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchWishlist(page);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-brand-cream py-20">
                <div className="container mx-auto px-6 text-center">
                    <HiOutlineHeart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-brand-dark-brown mb-4">
                        Please login to view your wishlist
                    </h2>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Page Header */}
            <div className="bg-brand-dark-brown py-16 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
                    My Wishlist
                    {total > 0 && (
                        <span className="text-sm font-normal bg-brand-gold text-brand-dark-brown px-3 py-1 rounded-full border border-brand-dark-brown/20 animate-in zoom-in duration-300">
                            {total} {total === 1 ? 'Item' : 'Items'}
                        </span>
                    )}
                </h1>
                <p className="text-white/70 max-w-2xl mx-auto">
                    {total > 0
                        ? `You have ${total} favorite ${total === 1 ? 'item' : 'items'} saved for later. Add them to cart when you're ready!`
                        : "Your favorite items saved for later. Add them to cart when you're ready!"}
                </p>
            </div>

            <div className="container mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <HiOutlineHeart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-brand-dark-brown mb-2">
                            Your wishlist is empty
                        </h3>
                        <p className="text-gray-500 mb-8">
                            Start adding items you love to your wishlist!
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-gray-600">
                                {total} item{total !== 1 ? "s" : ""} in your wishlist
                            </span>
                        </div>

                        {/* Wishlist Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {wishlist.map((product) => (
                                <div
                                    key={product._id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Product Image */}
                                    <div className="relative overflow-hidden">
                                        <Link to={`/product/${product.slug || product._id}`}>
                                            <img
                                                src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
                                                alt={product.name}
                                                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </Link>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product._id)}
                                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            title="Remove from wishlist"
                                        >
                                            <HiOutlineTrash className="w-5 h-5" />
                                        </button>

                                        {/* Badges */}
                                        {product.isNewArrival && (
                                            <span className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase rounded-full">
                                                New
                                            </span>
                                        )}
                                        {product.isFeatured && (
                                            <span className="absolute top-3 left-3 px-3 py-1 bg-brand-gold text-brand-dark-brown text-xs font-bold uppercase rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <Link to={`/product/${product.slug || product._id}`}>
                                            <h3 className="font-semibold text-brand-dark-brown mb-1 line-clamp-1 group-hover:text-brand-gold transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-brand-gold">
                                                ${product.price?.toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.countInStock === 0}
                                                className={`p-2 rounded-full transition-all ${product.countInStock === 0
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-brand-dark-brown text-white hover:bg-brand-gold hover:text-brand-dark-brown"
                                                    }`}
                                                title={product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                                            >
                                                <HiOutlineShoppingBag className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {product.countInStock === 0 && (
                                            <p className="text-red-500 text-xs mt-2">Out of Stock</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                                ? "bg-brand-dark-brown text-white"
                                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* Size Selection Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark-brown">Select Options</h3>
                                <p className="text-sm text-gray-500">{selectedProduct.name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        {selectedProduct.sizes?.length > 0 ? (
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select Size</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProduct.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${selectedSize === size
                                                ? 'bg-brand-dark-brown text-white border-brand-dark-brown'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-gold'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="mb-6 text-gray-500">One size available</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAddToCart}
                                className="flex-1 py-3 bg-brand-dark-brown text-white rounded-xl font-bold hover:bg-brand-gold hover:text-brand-dark-brown transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
