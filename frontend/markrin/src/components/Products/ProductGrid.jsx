import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiStar,
} from "react-icons/hi2";
import { wishlistAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { getCardUrl } from "../../utils/cloudinaryHelper";

function ProductGrid({ products = [] }) {
  const [wishlist, setWishlist] = useState(new Set());
  const { isAuthenticated } = useAuth();

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (wishlist.has(productId)) {
        await wishlistAPI.remove(productId);
        setWishlist((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success("Removed from wishlist");
      } else {
        await wishlistAPI.add(productId);
        setWishlist((prev) => new Set(prev).add(productId));
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <HiOutlineShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-lg font-bold text-brand-dark-brown mb-2">
          No products found
        </p>
        <p className="text-sm text-gray-400 text-center max-w-sm">
          Try adjusting your filters or search criteria to find what you're
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
      {products.map((product) => {
        const discountPercentage =
          product.discountPrice && product.discountPrice < product.price
            ? Math.round(
              ((product.price - product.discountPrice) / product.price) * 100
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
            className="group"
          >
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-400">
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
                  {product.isFeatured && (
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
                  onClick={(e) => toggleWishlist(e, product._id)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${wishlist.has(product._id)
                      ? "bg-red-50 text-red-500 shadow-sm"
                      : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    }`}
                >
                  {wishlist.has(product._id) ? (
                    <HiHeart className="w-4 h-4" />
                  ) : (
                    <HiOutlineHeart className="w-4 h-4" />
                  )}
                </button>

                {/* Quick Add */}
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
              <div className="p-3.5 sm:p-4">
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
  );
}

export default ProductGrid;
