import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiHeart,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineShoppingBag,
  HiStar,
} from "react-icons/hi2";
import { productsAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "sonner";
import { getCardUrl } from "../../utils/cloudinaryHelper";

function BestSellersCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll({
          sortBy: "popularity",
          limit: 12,
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch best sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleWishlist(productId);
    } catch (err) {
      console.error(err);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12 lg:py-16 px-4 lg:px-8 bg-brand-cream">
        <div className="container mx-auto">
          <div className="mb-8">
            <div className="w-48 h-8 bg-gray-200 rounded-lg skeleton-shimmer" />
            <div className="w-64 h-4 bg-gray-200 rounded-lg mt-2 skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white">
                <div className="aspect-[3/4] skeleton-shimmer" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-16 skeleton-shimmer rounded" />
                  <div className="h-4 w-3/4 skeleton-shimmer rounded" />
                  <div className="h-4 w-1/3 skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-8 bg-brand-cream">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-2">
              Top Picks
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-dark-brown tracking-tight">
              Best Sellers
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-all duration-200"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-all duration-200"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          {products.map((product) => {
            const discountPercentage =
              product.discountPrice &&
                product.discountPrice < product.price
                ? Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                  100
                )
                : 0;
            const displayPrice =
              product.discountPrice && product.discountPrice < product.price
                ? product.discountPrice
                : product.price;

            return (
              <Link
                key={product._id}
                to={`/product/${product.slug || product._id}`}
                className="group flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] snap-start"
              >
                <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-400">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                    <img
                      src={getCardUrl(product.images?.[0]?.url)}
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
                      {discountPercentage > 0 && (
                        <span className="px-2.5 py-1 bg-brand-maroon-accent text-white text-[9px] font-bold uppercase tracking-wider rounded-lg">
                          -{discountPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, product._id)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isInWishlist(product._id)
                          ? "bg-red-50 text-red-500"
                          : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        }`}
                    >
                      {isInWishlist(product._id) ? (
                        <HiHeart className="w-4.5 h-4.5" />
                      ) : (
                        <HiOutlineHeart className="w-4.5 h-4.5" />
                      )}
                    </button>

                    {/* Quick Add Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-full py-2.5 bg-brand-dark-brown/95 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <HiOutlineShoppingBag className="w-4 h-4" />
                        Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.2em] mb-1">
                      {product.brand || "Markrin"}
                    </p>
                    <h3 className="font-semibold text-brand-dark-brown text-sm mb-2 line-clamp-1 group-hover:text-brand-gold transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-dark-brown text-base">
                        ₹{displayPrice?.toFixed(0)}
                      </span>
                      {discountPercentage > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.price?.toFixed(0)}
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
            );
          })}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-10">
          <Link
            to="/shop"
            className="px-8 py-3.5 border-2 border-brand-dark-brown text-brand-dark-brown font-bold uppercase tracking-[0.15em] text-sm rounded-xl hover:bg-brand-dark-brown hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BestSellersCarousel;
