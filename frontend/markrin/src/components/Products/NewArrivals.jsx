import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HiChevronLeft,
  HiChevronRight,
  HiArrowRight,
} from "react-icons/hi2";
import { productsAPI } from "../../api";
import { getCardUrl } from "../../utils/cloudinaryHelper";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getNewArrivals();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

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
      <section className="py-12 lg:py-16 px-4 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="mb-8">
            <div className="w-36 h-3 bg-gray-200 rounded skeleton-shimmer mb-2" />
            <div className="w-48 h-7 bg-gray-200 rounded skeleton-shimmer" />
          </div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)]">
                <div className="rounded-2xl overflow-hidden bg-gray-50">
                  <div className="aspect-[3/4] skeleton-shimmer" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 skeleton-shimmer rounded" />
                    <div className="h-4 w-3/4 skeleton-shimmer rounded" />
                    <div className="h-4 w-1/3 skeleton-shimmer rounded" />
                  </div>
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
    <section className="py-12 lg:py-16 px-4 lg:px-8 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-2">
              Just Dropped
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-dark-brown tracking-tight">
              New Arrivals
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-gold transition-all duration-200"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-gold transition-all duration-200"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          {products.map((product) => {
            const activeBasePrice = product.basePrice || product.price || 0;
            const displayPrice =
              product.discountPrice && product.discountPrice < activeBasePrice
                ? product.discountPrice
                : activeBasePrice;

            return (
              <Link
                key={product._id}
                to={`/product/${product.slug || product._id}`}
                className="group flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] snap-start"
              >
                <div className="rounded-2xl overflow-hidden bg-gray-50 hover:shadow-lg transition-shadow duration-400">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={getCardUrl(product.images?.[0]?.url)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* New Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                      New
                    </span>

                    {/* View Product overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
                      {product.discountPrice &&
                        product.discountPrice < activeBasePrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{activeBasePrice?.toFixed(0)}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-10">
          <Link
            to="/collection/new-arrivals"
            className="group flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-wider hover:text-brand-dark-brown transition-colors"
          >
            View All New Arrivals
            <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
