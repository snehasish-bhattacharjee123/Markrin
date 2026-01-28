import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { productsAPI } from "../api";
import FilterSidebar from "../components/Products/FilterSidebar";
import { useCart } from "../context/CartContext";

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Build filter object from URL params
                const filters = {};
                const category = searchParams.get("category");
                const gender = searchParams.get("gender");
                const sort = searchParams.get("sort");
                const search = searchParams.get("search");

                if (category) filters.category = category;
                if (gender) filters.gender = gender;
                if (sort) filters.sort = sort;
                if (search) filters.search = search;

                const data = await productsAPI.getAll(filters);
                setProducts(data.products || data);
            } catch (err) {
                console.error("Error fetching products:", err);
                // Fallback mock data
                setProducts([
                    { _id: null, name: "Classic White T-Shirt", price: 29.99, images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" }] },
                    { _id: null, name: "Black Graphic Tee", price: 34.99, images: [{ url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500" }] },
                    { _id: null, name: "Casual Blue T-Shirt", price: 19.99, images: [{ url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500" }] },
                    { _id: null, name: "Oversized Streetwear", price: 49.99, images: [{ url: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500" }] },
                    { _id: null, name: "Minimal Grey T-Shirt", price: 24.99, images: [{ url: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=500" }] },
                    { _id: null, name: "Printed Fashion Tee", price: 59.99, images: [{ url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500" }] },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Page Header */}
            <div className="bg-brand-dark-brown py-16 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    Shop All Products
                </h1>
                <p className="text-white/70 max-w-2xl mx-auto">
                    Discover our complete collection of premium streetwear and fashion essentials.
                </p>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex justify-between items-center mb-4">
                        <span className="text-gray-600">{products.length} products</span>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-grow">
                        {/* Results Count */}
                        <div className="hidden lg:flex justify-between items-center mb-8">
                            <span className="text-gray-600">{products.length} products found</span>
                            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20">
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 h-72 rounded-2xl mb-4" />
                                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
                                        <div className="bg-gray-200 h-4 w-1/4 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <HiOutlineShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-600 mb-2">No products found</h3>
                                <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="group">
                                        <div className="relative overflow-hidden rounded-2xl bg-gray-100 mb-4">
                                            {product._id ? (
                                                <Link to={`/product/${product._id}`}>
                                                <img
                                                    src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
                                                    alt={product.name}
                                                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                </Link>
                                            ) : (
                                                <img
                                                    src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
                                                    alt={product.name}
                                                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            )}

                                            {/* Hover Actions */}
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => product._id && addItem({ productId: product._id, quantity: 1 })}
                                                        className="flex-grow py-3 bg-white text-brand-dark-brown font-bold text-xs uppercase tracking-wider hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <HiOutlineShoppingBag className="w-4 h-4" />
                                                        Add to Cart
                                                    </button>
                                                    <button className="p-3 bg-white text-brand-dark-brown hover:bg-red-50 hover:text-red-500 transition-colors">
                                                        <HiOutlineHeart className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Badges */}
                                            {product.isNewArrival && (
                                                <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase rounded-full">
                                                    New
                                                </span>
                                            )}
                                            {product.isFeatured && (
                                                <span className="absolute top-4 left-4 px-3 py-1 bg-brand-gold text-brand-dark-brown text-xs font-bold uppercase rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {product._id ? (
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="font-semibold text-brand-dark-brown mb-1 group-hover:text-brand-gold transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-lg font-bold text-brand-gold">
                                                    ${product.price?.toFixed(2)}
                                                </p>
                                            </Link>
                                        ) : (
                                            <>
                                                <h3 className="font-semibold text-brand-dark-brown mb-1 group-hover:text-brand-gold transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-lg font-bold text-brand-gold">
                                                    ${product.price?.toFixed(2)}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute top-0 left-0 w-80 h-full bg-white p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Filters</h3>
                            <button onClick={() => setSidebarOpen(false)} className="text-gray-500">
                                ✕
                            </button>
                        </div>
                        <FilterSidebar />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Shop;
