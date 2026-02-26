import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineTrash } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";
import { RiDeleteBinLine } from 'react-icons/ri';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();

    // Popup state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setSelectedSize("");
    };

    const confirmAddToCart = async () => {
        await addItem({
            productId: selectedProduct._id,
            quantity: 1
        });

        setSelectedProduct(null);
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
                    {wishlist.length > 0 && (
                        <span className="text-sm font-normal bg-brand-gold text-brand-dark-brown px-3 py-1 rounded-full border border-brand-dark-brown/20 animate-in zoom-in duration-300">
                            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                        </span>
                    )}
                </h1>
                <p className="text-white/70 max-w-2xl mx-auto">
                    {wishlist.length > 0
                        ? `You have ${wishlist.length} favorite ${wishlist.length === 1 ? 'item' : 'items'} saved for later. Add them to cart when you're ready!`
                        : "Your favorite items saved for later. Add them to cart when you're ready!"}
                </p>
            </div>

            <div className="container mx-auto px-6 py-12">
                {wishlist.length === 0 ? (
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
                                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your wishlist
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
                                            onClick={() => removeFromWishlist(product._id)}
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
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-brand-gold">
                                                    ₹{(product.discountPrice && product.discountPrice < product.basePrice ? product.discountPrice : product.basePrice)?.toFixed(0) || 0}
                                                </span>
                                                {product.discountPrice > 0 && product.discountPrice < product.basePrice && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        ₹{product.basePrice?.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="p-2 rounded-full transition-all bg-brand-dark-brown text-white hover:bg-brand-gold hover:text-brand-dark-brown"
                                                title="Add to Cart"
                                            >
                                                <HiOutlineShoppingBag className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

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

                            <p className="mb-6 text-gray-500">Variants selection coming soon...</p>

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
        </div>
    );
};

export default Wishlist;
