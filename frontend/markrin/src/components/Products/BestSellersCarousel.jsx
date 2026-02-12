import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight, HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { productsAPI, wishlistAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

function BestSellersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const itemsPerView = {
    mobile: 2,
    tablet: 3,
    desktop: 4
  };

  const maxIndex = Math.max(0, products.length - itemsPerView.desktop);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getFeatured();
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const toggleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      if (wishlistItems.has(product._id)) {
        await wishlistAPI.remove(product._id);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(product._id);
          return newSet;
        });
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.add(product._id);
        setWishlistItems((prev) => new Set([...prev, product._id]));
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await wishlistAPI.get(1, 100);
        const ids = new Set(data.products?.map((p) => p._id) || []);
        setWishlistItems(ids);
      } catch (err) {
        // ignore
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <section className="py-8 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-dark-brown">Best Sellers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-3/4 rounded-2xl" />
                <div className="bg-gray-200 h-4 w-3/4 rounded mt-2" />
                <div className="bg-gray-200 h-4 w-1/2 rounded mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-brand-cream">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-dark-brown">Best Sellers</h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg disabled:opacity-0 hover:bg-brand-gold hover:text-white transition-all hidden lg:block"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg disabled:opacity-0 hover:bg-brand-gold hover:text-white transition-all hidden lg:block"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)` }}
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4 group"
                >
                  <Link to={`/product/${product.slug || product._id}`} className="block">
                    <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
                      {/* Image Container */}
                      <div className="relative aspect-3/4 overflow-hidden">
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(e, product)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
                        >
                          {wishlistItems.has(product._id) ? (
                            <HiHeart className="w-5 h-5 text-red-500" />
                          ) : (
                            <HiOutlineHeart className="w-5 h-5 text-gray-600" />
                          )}
                        </button>

                        {/* Sale Badge */}
                        {product.discountPrice > 0 && product.discountPrice < product.price && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            Sale
                          </span>
                        )}

                        {/* New Badge */}
                        {product.isNewArrival && (
                          <span className="absolute bottom-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-brand-dark-brown text-sm mb-1 line-clamp-1 group-hover:text-brand-gold transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(product.rating))}</span>
                            <span className="text-gray-400 text-xs">({product.numReviews})</span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-dark-brown">
                            ₹{product.price?.toFixed(2)}
                          </span>
                          {product.discountPrice > 0 && product.discountPrice < product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.price?.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-2 mt-6 lg:hidden">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSellersCarousel;
