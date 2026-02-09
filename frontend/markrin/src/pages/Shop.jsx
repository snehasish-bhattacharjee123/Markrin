import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineHeart, HiHeart, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { productsAPI, wishlistAPI } from "../api";
import FilterSidebar from "../components/Products/FilterSidebar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const [wishlistLoading, setWishlistLoading] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

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
                const color = searchParams.get("color");
                const size = searchParams.get("size");
                const material = searchParams.get("material");
                const maxPrice = searchParams.get("maxPrice");

                if (category) filters.category = category;
                if (gender) filters.gender = gender;
                if (sort) filters.sort = sort;
                if (search) filters.search = search;
                if (color) filters.color = color;
                if (size) filters.size = size;
                if (material) filters.material = material;
                if (maxPrice) filters.maxPrice = maxPrice;

                filters.page = currentPage;
                filters.limit = 12;

                const data = await productsAPI.getAll(filters);
                setProducts(data.products || data);
                setTotalPages(data.pages || 1);
                setTotalProducts(data.total || 0);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams, currentPage]);

    // Fetch wishlist items
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!isAuthenticated) {
                setWishlistItems(new Set());
                return;
            }

            try {
                const data = await wishlistAPI.get(1, 100);
                const wishlistProductIds = new Set(data.products?.map(p => p._id) || []);
                setWishlistItems(wishlistProductIds);
            } catch (err) {
                // Ignore wishlist fetch errors
            }
        };

        fetchWishlist();
    }, [isAuthenticated]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        const newParams = new URLSearchParams(searchParams);
        if (value === "newest") {
            newParams.delete("sort");
        } else {
            newParams.set("sort", value);
        }
        setSearchParams(newParams);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleWishlist = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to add items to wishlist");
            return;
        }

        const productId = product._id;
        setWishlistLoading(prev => ({ ...prev, [productId]: true }));

        try {
            if (wishlistItems.has(productId)) {
                await wishlistAPI.remove(productId);
                setWishlistItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                toast.success("Removed from wishlist");
            } else {
                await wishlistAPI.add(productId);
                setWishlistItems(prev => new Set([...prev, productId]));
                toast.success("Added to wishlist");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setWishlistLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (product._id) {
            await addItem({ productId: product._id, quantity: 1 });
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Page Header */}
            <div className="bg-brand-dark-brown py-16 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {searchParams.get("search")
                        ? `Search: ${searchParams.get("search")}`
                        : "Shop All Products"}
                </h1>
                <p className="text-white/70 max-w-2xl mx-auto mb-6">
                    {searchParams.get("search")
                        ? `Showing results for "${searchParams.get("search")}"`
                        : "Discover our complete collection of premium streetwear and fashion essentials."}
                </p>
                {searchParams.get("search") && (
                    <button
                        onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            newParams.delete("search");
                            setSearchParams(newParams);
                        }}
                        className="inline-flex items-center gap-2 text-brand-gold hover:text-white transition-colors font-bold uppercase tracking-wider text-xs"
                    >
                        ✕ Clear Search
                    </button>
                )}
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex justify-between items-center mb-4">
                        <span className="text-gray-600">{totalProducts} products</span>
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
                        {/* Results Count & Sort */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <span className="text-gray-600">{totalProducts} products found</span>
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 bg-white"
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                                <option value="name_desc">Name: Z to A</option>
                                <option value="rating">Most Popular</option>
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
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div key={product._id} className="group">
                                            <div className="relative overflow-hidden rounded-2xl bg-white mb-4 shadow-sm">
                                                <Link to={`/product/${product.slug || product._id}`}>
                                                    <img
                                                        src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
                                                        alt={product.name}
                                                        className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </Link>

                                                {/* Hover Actions */}
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, product)}
                                                            disabled={product.countInStock === 0}
                                                            className={`flex-grow py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${product.countInStock === 0
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-white text-brand-dark-brown hover:bg-brand-gold'
                                                                }`}
                                                        >
                                                            <HiOutlineShoppingBag className="w-4 h-4" />
                                                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => toggleWishlist(e, product)}
                                                            disabled={wishlistLoading[product._id]}
                                                            className={`p-3 transition-colors ${wishlistItems.has(product._id)
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-white text-brand-dark-brown hover:bg-red-50 hover:text-red-500'
                                                                }`}
                                                        >
                                                            {wishlistLoading[product._id] ? (
                                                                <div className="w-5 h-5 animate-spin border-b-2 border-current rounded-full" />
                                                            ) : wishlistItems.has(product._id) ? (
                                                                <HiHeart className="w-5 h-5" />
                                                            ) : (
                                                                <HiOutlineHeart className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Badges */}
                                                {product.isNewArrival && (
                                                    <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase rounded-full">
                                                        New
                                                    </span>
                                                )}
                                                {product.isFeatured && !product.isNewArrival && (
                                                    <span className="absolute top-4 left-4 px-3 py-1 bg-brand-gold text-brand-dark-brown text-xs font-bold uppercase rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                                {product.countInStock === 0 && (
                                                    <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase rounded-full">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </div>

                                            <Link to={`/product/${product.slug || product._id}`}>
                                                <p className="text-xs uppercase tracking-wider text-brand-gold font-bold mb-1">{product.category}</p>
                                                <h3 className="font-semibold text-brand-dark-brown mb-1 group-hover:text-brand-gold transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-lg font-bold text-brand-gold">
                                                    ${product.price?.toFixed(2)}
                                                </p>
                                            </Link>
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
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum
                                                            ? "bg-brand-dark-brown text-white"
                                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
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
                </div>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute top-0 left-0 w-80 h-full bg-white overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-bold">Filters</h3>
                            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 text-2xl">
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
