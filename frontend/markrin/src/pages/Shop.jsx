import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    HiOutlineShoppingBag,
    HiOutlineHeart,
    HiHeart,
    HiOutlineAdjustmentsHorizontal,
    HiXMark,
    HiStar,
} from "react-icons/hi2";
import { productsAPI } from "../api";
import FilterSidebar from "../components/Products/FilterSidebar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getCardUrl } from "../utils/cloudinaryHelper";
import { toast } from "sonner";
import QuickAddModal from "../components/Products/QuickAddModal";

const ITEMS_PER_PAGE = 12;

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
    const [wishlistLoading, setWishlistLoading] = useState({});
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
    const loadMoreRef = useRef(null);
    const sidebarRef = useRef(null);
    const [quickAddProduct, setQuickAddProduct] = useState(null);

    // Fetch products with pagination
    const fetchProducts = useCallback(
        async (pageNum = 1, append = false) => {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            try {
                const filters = {};
                const category = searchParams.get("category");
                const gender = searchParams.get("gender");
                const search = searchParams.get("search");
                const color = searchParams.get("color");
                const size = searchParams.get("size");
                const material = searchParams.get("material");
                const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");

                if (category) filters.category = category;
                if (gender) filters.gender = gender;
                if (search) filters.search = search;
                if (color) filters.color = color;
                if (size) filters.size = size;
                if (material) filters.material = material;
                if (minPrice) filters.minPrice = minPrice;
                if (maxPrice) filters.maxPrice = maxPrice;

                filters.sort = sortBy;
                filters.page = pageNum;
                filters.limit = ITEMS_PER_PAGE;

                const data = await productsAPI.getAll(filters);
                const newProducts = data.products || data;
                const total = data.total || newProducts.length;

                if (append) {
                    setProducts((prev) => [...prev, ...newProducts]);
                } else {
                    setProducts(newProducts);
                }
                setTotalProducts(total);
                setHasMore(pageNum * ITEMS_PER_PAGE < total);
            } catch (err) {
                console.error("Error fetching products:", err);
                if (!append) setProducts([]);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [searchParams, sortBy]
    );

    // Reset and fetch on filter/search change
    useEffect(() => {
        setPage(1);
        setProducts([]);
        fetchProducts(1, false);
    }, [searchParams, sortBy, fetchProducts]);

    // Infinite scroll observer
    useEffect(() => {
        if (!loadMoreRef.current || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loadingMore &&
                    !loading
                ) {
                    setPage((prev) => {
                        const nextPage = prev + 1;
                        fetchProducts(nextPage, true);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1, rootMargin: "200px" }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, fetchProducts]);



    // Close sidebar on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        };
        if (sidebarOpen)
            document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sidebarOpen]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        const newParams = new URLSearchParams(searchParams);
        if (e.target.value === "newest") newParams.delete("sort");
        else newParams.set("sort", e.target.value);
        setSearchParams(newParams);
    };

    const handleToggleWishlist = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = product._id;
        setWishlistLoading((prev) => ({ ...prev, [productId]: true }));
        try {
            await toggleWishlist(productId);
        } catch (err) {
            console.error(err);
        } finally {
            setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        setQuickAddProduct(product);
    };

    // Get active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (searchParams.get("category")) count++;
        if (searchParams.get("gender")) count++;
        if (searchParams.get("color")) count++;
        if (searchParams.get("size")) count++;
        if (searchParams.get("material")) count++;
        if (searchParams.get("minPrice") && Number(searchParams.get("minPrice")) > 0) count++;
        if (searchParams.get("maxPrice") && Number(searchParams.get("maxPrice")) < 500) count++;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    const ProductSkeleton = () => (
        <div className="rounded-2xl overflow-hidden bg-white">
            <div className="aspect-[3/4] skeleton-shimmer" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-16 skeleton-shimmer rounded" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded" />
                <div className="h-4 w-1/3 skeleton-shimmer rounded" />
            </div>
        </div>
    );

    const searchTerm = searchParams.get("search");

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* ============================================ */}
            {/* Page Header */}
            {/* ============================================ */}
            <div className="bg-brand-dark-brown py-14 lg:py-20 text-center relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,167,110,0.15),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(201,167,110,0.08),transparent_50%)]" />
                </div>

                <div className="relative z-10 px-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-3">
                        {searchTerm ? "Search Results" : "Our Collection"}
                    </p>
                    <h1 className="text-3xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                        {searchTerm ? `"${searchTerm}"` : "Shop All Products"}
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-sm lg:text-base">
                        {searchTerm
                            ? `Showing results for "${searchTerm}"`
                            : "Discover our complete collection of premium streetwear and fashion essentials."}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.delete("search");
                                setSearchParams(newParams);
                            }}
                            className="mt-5 inline-flex items-center gap-2 text-brand-gold hover:text-white transition-colors font-bold uppercase tracking-wider text-xs border border-brand-gold/30 px-5 py-2.5 rounded-xl hover:bg-brand-gold/20"
                        >
                            <HiXMark className="w-4 h-4" /> Clear Search
                        </button>
                    )}
                </div>
            </div>

            {/* ============================================ */}
            {/* Sticky Toolbar */}
            {/* ============================================ */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors relative"
                        >
                            <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gold text-brand-dark-brown text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <span className="text-sm text-gray-400">
                            <span className="font-bold text-brand-dark-brown">
                                {totalProducts}
                            </span>{" "}
                            products
                        </span>
                    </div>

                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 bg-white font-medium cursor-pointer"
                    >
                        <option value="newest">Newest</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                        <option value="name_asc">Name: A → Z</option>
                        <option value="name_desc">Name: Z → A</option>
                        <option value="rating">Popularity</option>
                    </select>
                </div>
            </div>

            {/* ============================================ */}
            {/* Main Content */}
            {/* ============================================ */}
            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Desktop Filter Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-[130px]">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Mobile Filter Sidebar */}
                    {sidebarOpen && (
                        <div className="lg:hidden fixed inset-0 z-50">
                            <div
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <div
                                ref={sidebarRef}
                                className="absolute top-0 left-0 w-80 h-full bg-white overflow-y-auto shadow-2xl rounded-r-2xl"
                            >
                                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-brand-dark-brown">
                                        Filters
                                    </h3>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <HiXMark className="w-6 h-6" />
                                    </button>
                                </div>
                                <FilterSidebar />
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-grow min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-5">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <HiOutlineShoppingBag className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark-brown mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-400 mb-6 text-sm">
                                    Try adjusting your filters or search terms.
                                </p>
                                <Link
                                    to="/shop"
                                    className="px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                                >
                                    Clear Filters
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-5">
                                    {products.map((product) => {
                                        const activeBasePrice = product.basePrice || product.price || 0;
                                        const discountPercentage =
                                            product.discountPrice &&
                                                product.discountPrice < activeBasePrice
                                                ? Math.round(
                                                    ((activeBasePrice - product.discountPrice) /
                                                        activeBasePrice) *
                                                    100
                                                )
                                                : product.originalPrice
                                                    ? Math.round(
                                                        ((product.originalPrice - activeBasePrice) /
                                                            product.originalPrice) *
                                                        100
                                                    )
                                                    : 0;

                                        return (
                                            <div key={product._id} className="group">
                                                <Link
                                                    to={`/product/${product.slug || product._id}`}
                                                    className="block"
                                                >
                                                    <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-400">
                                                        {/* Image */}
                                                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                                            <img
                                                                src={
                                                                    getCardUrl(product.images?.[0]?.url) ||
                                                                    "https://via.placeholder.com/400"
                                                                }
                                                                alt={product.name}
                                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                                loading="lazy"
                                                            />

                                                            {/* Badges */}
                                                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                                                {product.isNewArrival && (
                                                                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg">
                                                                        New
                                                                    </span>
                                                                )}
                                                                {product.isFeatured && !product.isNewArrival && (
                                                                    <span className="px-2.5 py-1 bg-brand-gold text-brand-dark-brown text-[9px] font-bold uppercase tracking-wider rounded-lg">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                                {discountPercentage > 0 && (
                                                                    <span className="px-2.5 py-1 bg-brand-maroon-accent text-white text-[9px] font-bold uppercase tracking-wider rounded-lg">
                                                                        -{discountPercentage}%
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Wishlist */}
                                                            <button
                                                                onClick={(e) => handleToggleWishlist(e, product)}
                                                                disabled={wishlistLoading[product._id]}
                                                                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isInWishlist(product._id)
                                                                    ? "bg-red-50 text-red-500 shadow-sm"
                                                                    : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                                                    }`}
                                                            >
                                                                {wishlistLoading[product._id] ? (
                                                                    <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-brand-gold rounded-full" />
                                                                ) : isInWishlist(product._id) ? (
                                                                    <HiHeart className="w-4 h-4" />
                                                                ) : (
                                                                    <HiOutlineHeart className="w-4 h-4" />
                                                                )}
                                                            </button>

                                                            {/* Quick Add */}
                                                            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                                <button
                                                                    onClick={(e) => handleAddToCart(e, product)}
                                                                    disabled={product.countInStock === 0}
                                                                    className={`w-full py-2.5 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg ${product.countInStock === 0
                                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                        : "bg-brand-dark-brown/95 backdrop-blur-sm text-white hover:bg-brand-gold hover:text-brand-dark-brown"
                                                                        }`}
                                                                >
                                                                    <HiOutlineShoppingBag className="w-4 h-4" />
                                                                    {product.countInStock === 0
                                                                        ? "Out of Stock"
                                                                        : "Add to Cart"}
                                                                </button>
                                                            </div>

                                                            {/* Sold Out Overlay */}
                                                            {product.countInStock === 0 && (
                                                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                                                                    <span className="px-4 py-2 bg-brand-dark-brown text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                                        Sold Out
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="p-3.5 sm:p-4">
                                                            <p className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.2em] mb-1">
                                                                {product.brand || "Markrin"}
                                                            </p>
                                                            <h3 className="text-sm font-semibold text-brand-dark-brown mb-2 group-hover:text-brand-gold transition-colors line-clamp-1">
                                                                {product.name}
                                                            </h3>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-brand-dark-brown text-base">
                                                                    ₹{
                                                                        (product.discountPrice && product.discountPrice < activeBasePrice
                                                                            ? product.discountPrice
                                                                            : activeBasePrice
                                                                        )?.toFixed(0)
                                                                    }
                                                                </span>
                                                                {(product.originalPrice || (product.discountPrice && product.discountPrice < activeBasePrice)) && (
                                                                    <span className="text-xs text-gray-400 line-through">
                                                                        ₹{(product.originalPrice || activeBasePrice)?.toFixed(0)}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Rating */}
                                                            {product.rating > 0 && (
                                                                <div className="flex items-center gap-1 mt-2">
                                                                    <HiStar className="w-3.5 h-3.5 text-amber-400" />
                                                                    <span className="text-xs text-gray-400 font-medium">
                                                                        {product.rating?.toFixed(1)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Load More Trigger */}
                                <div ref={loadMoreRef} className="py-8">
                                    {loadingMore && (
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <ProductSkeleton key={`lm-${i}`} />
                                            ))}
                                        </div>
                                    )}
                                    {!hasMore && products.length > 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 text-sm">
                                                You've seen all {totalProducts} products
                                            </p>
                                            <div className="mt-2 w-16 h-0.5 bg-brand-gold/30 mx-auto rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <QuickAddModal
                isOpen={!!quickAddProduct}
                onClose={() => setQuickAddProduct(null)}
                product={quickAddProduct}
            />
        </div>
    );
}

export default Shop;
