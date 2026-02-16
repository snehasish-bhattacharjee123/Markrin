import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { useParams, Link, useSearchParams, useLocation } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineHeart, HiHeart, HiChevronRight } from "react-icons/hi2";
import { productsAPI } from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";
import { getCardUrl } from "../utils/cloudinaryHelper";
import FilterSidebar from "../components/Products/FilterSidebar";

const ITEMS_PER_PAGE = 12;

const collectionMeta = {
  men: { title: "Men's Collection", description: "Discover premium menswear designed for the modern man.", banner: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=80" },
  women: { title: "Women's Collection", description: "Elegant fashion essentials crafted for the confident woman.", banner: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80" },
  unisex: { title: "Unisex Collection", description: "Fashion that fits everyone. No boundaries, just great style.", banner: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80" },
  hoodie: { title: "Hoodies", description: "Cozy hoodies to keep you warm and stylish all season long.", banner: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80" },
  oversized: { title: "Oversized Collection", description: "Bold, oversized fits for the ultimate streetwear look.", banner: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=1600&q=80" },
  "sweat-shirt": { title: "Sweatshirts", description: "Premium sweatshirts that combine comfort with street style.", banner: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1600&q=80" },
  "normal-tshirt": { title: "T-Shirts", description: "Classic tees that are essentials in every wardrobe.", banner: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=80" },
  "new-arrivals": { title: "New Arrivals", description: "Fresh drops just for you. Be the first to get the latest.", banner: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80" },
  featured: { title: "Featured Products", description: "Our handpicked selection of the best products.", banner: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&q=80" },
  all: { title: "All Products", description: "Browse our complete collection of premium fashion.", banner: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=80" },
};

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [wishlistLoading, setWishlistLoading] = useState({});
  const sidebarRef = useRef(null);
  const loadMoreRef = useRef(null);
  const { collection: paramCollection } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  // Derive collection from URL params or pathname (for direct routes like /hoodie)
  const collection = paramCollection || location.pathname.replace(/^\//, '').split('/')[0] || 'all';

  const meta = collectionMeta[collection] || { title: collection?.replace(/-/g, " ") || "Collection", description: "Browse our collection.", banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar when clicking outside (Mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);



  // Fetch products
  const fetchProducts = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const filters = {};
      // Map route to backend filters
      if (collection === 'men') filters.gender = 'Men';
      if (collection === 'women') filters.gender = 'Women';
      if (collection === 'unisex') filters.gender = 'Unisex';

      const validCategories = ['oversized', 'sweat-shirt', 'hoodie', 'normal-tshirt'];
      if (collection && !['all', 'men', 'women', 'unisex', 'new-arrivals', 'featured'].includes(collection)) {
        if (validCategories.includes(collection)) {
          filters.category = collection;
        }
      }

      // Add search params filters
      const category = searchParams.get("category");
      const color = searchParams.get("color");
      const size = searchParams.get("size");
      const material = searchParams.get("material");
      const maxPrice = searchParams.get("maxPrice");
      const gender = searchParams.get("gender");
      if (category) filters.category = category;
      if (color) filters.color = color;
      if (size) filters.size = size;
      if (material) filters.material = material;
      if (maxPrice) filters.maxPrice = maxPrice;
      if (gender) filters.gender = gender;

      filters.sort = sortBy;
      filters.page = pageNum;
      filters.limit = ITEMS_PER_PAGE;

      let data;
      if (collection === 'new-arrivals') {
        data = await productsAPI.getNewArrivals();
        const allProducts = Array.isArray(data) ? data : (data.products || []);
        const paginatedProducts = allProducts.slice(0, pageNum * ITEMS_PER_PAGE);
        setProducts(paginatedProducts);
        setTotalProducts(allProducts.length);
        setHasMore(paginatedProducts.length < allProducts.length);
        return;
      }

      if (collection === 'featured') {
        data = await productsAPI.getFeatured();
        const allProducts = Array.isArray(data) ? data : (data.products || []);
        const paginatedProducts = allProducts.slice(0, pageNum * ITEMS_PER_PAGE);
        setProducts(paginatedProducts);
        setTotalProducts(allProducts.length);
        setHasMore(paginatedProducts.length < allProducts.length);
        return;
      }

      data = await productsAPI.getAll(filters);
      const newProducts = data.products || data;
      const total = data.total || newProducts.length;

      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      setTotalProducts(total);
      setHasMore(pageNum * ITEMS_PER_PAGE < total);
    } catch (err) {
      console.error('Error fetching collection products:', err);
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [collection, searchParams, sortBy]);

  // Reset and fetch on collection/filter change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, false);
  }, [collection, searchParams, sortBy, fetchProducts]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchProducts(nextPage, true);
            return nextPage;
          });
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchProducts]);

  const handleToggleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product._id;
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await toggleWishlist(productId);
    } catch (err) {
      console.error(err);
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

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Product card skeleton
  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-[3/4] rounded-2xl mb-3" />
      <div className="space-y-2 px-1">
        <div className="bg-gray-200 h-3 w-1/3 rounded" />
        <div className="bg-gray-200 h-4 w-3/4 rounded" />
        <div className="bg-gray-200 h-4 w-1/4 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Collection Hero Banner */}
      <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden">
        <img
          src={meta.banner}
          alt={meta.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <HiChevronRight className="w-4 h-4" />
            <Link to="/collections" className="hover:text-white transition-colors">Collections</Link>
            <HiChevronRight className="w-4 h-4" />
            <span className="text-white font-medium capitalize">{collection?.replace(/-/g, " ")}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 capitalize">
            {meta.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <FiFilter className="w-4 h-4" /> Filters
            </button>
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{totalProducts}</span> Products
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500 hidden sm:inline">Sort by:</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 bg-white font-medium"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">A – Z</option>
              <option value="name_desc">Z – A</option>
              <option value="rating">Popularity</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Sidebar Overlay */}
          <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} />
          <aside
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto shadow-2xl
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="font-bold text-brand-dark-brown text-lg">Filters</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={22} />
              </button>
            </div>
            <FilterSidebar />
          </aside>

          {/* Products Grid */}
          <div className="flex-grow min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <HiOutlineShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-3">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or browse other collections.</p>
                <Link to="/shop" className="inline-block px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-brand-gold hover:text-brand-dark-brown transition-all">
                  Shop All Products
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="group">
                      <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-3 aspect-[3/4]">
                        <Link to={`/product/${product.slug || product._id}`}>
                          <img
                            src={getCardUrl(product.images?.[0]?.url) || "https://via.placeholder.com/400"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleToggleWishlist(e, product)}
                          disabled={wishlistLoading[product._id]}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-all hover:scale-110"
                        >
                          {wishlistLoading[product._id] ? (
                            <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-brand-gold rounded-full" />
                          ) : isInWishlist(product._id) ? (
                            <HiHeart className="w-4 h-4 text-red-500" />
                          ) : (
                            <HiOutlineHeart className="w-4 h-4 text-gray-500" />
                          )}
                        </button>

                        {/* Hover Action */}
                        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.countInStock === 0}
                            className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${product.countInStock === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-white text-brand-dark-brown hover:bg-brand-gold'
                              }`}
                          >
                            <HiOutlineShoppingBag className="w-4 h-4" />
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.isNewArrival && (
                            <span className="px-2.5 py-1 bg-green-500 text-white text-[10px] font-bold uppercase rounded-full">New</span>
                          )}
                          {product.isFeatured && !product.isNewArrival && (
                            <span className="px-2.5 py-1 bg-brand-gold text-brand-dark-brown text-[10px] font-bold uppercase rounded-full">Featured</span>
                          )}
                          {product.originalPrice && (
                            <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          )}
                        </div>

                        {product.countInStock === 0 && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded-lg">Sold Out</span>
                          </div>
                        )}
                      </div>

                      <Link to={`/product/${product.slug || product._id}`} className="block px-1">
                        <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.15em] mb-1">
                          {product.brand || "Markrin"}
                        </p>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-brand-gold transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">₹{product.price?.toFixed(2)}</span>
                          {product.originalPrice && (
                            <>
                              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice?.toFixed(2)}</span>
                              <span className="text-xs font-bold text-green-600">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        {/* Rating */}
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded">
                              ★ {product.rating?.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Load More Trigger */}
                <div ref={loadMoreRef} className="py-8">
                  {loadingMore && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                      {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={`loading-${i}`} />)}
                    </div>
                  )}
                  {!hasMore && products.length > 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">You've seen all {totalProducts} products</p>
                      <div className="mt-2 w-16 h-0.5 bg-brand-gold/30 mx-auto rounded-full" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
