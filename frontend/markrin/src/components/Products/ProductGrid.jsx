import React from "react";
import { Link } from "react-router-dom";
import { RiShoppingBagLine } from "react-icons/ri";

function ProductGrid({ products }) {
  // Return null or a message if products is not an array
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-20 bg-brand-cream rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">
          No products found in this collection.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid - Adjusted to 4 columns on large screens, 3 on medium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => {
          // Safety check for image source (handles both array and single object)
          const displayImage = Array.isArray(product.image)
            ? product.image[0]?.url
            : product.image?.url;

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group block"
            >
              {/* Image Container with 2026 Aspect Ratio */}
              <div className="relative overflow-hidden bg-brand-white rounded-2xl shadow-sm mb-5 aspect-[3/4]">
                <img
                  src={displayImage || "https://via.placeholder.com"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />

                {/* Quick Add Overlay - Slide up on hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 bg-gradient-to-t from-brand-dark-brown/90 to-transparent">
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevents navigation to product page
                      // Add to cart logic here
                    }}
                    className="w-full py-3 bg-brand-gold text-brand-dark-brown text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-brand-white transition-all transform active:scale-95"
                  >
                    <RiShoppingBagLine size={16} />
                    Quick Add
                  </button>
                </div>

                {/* Status Tags */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.originalPrice && (
                    <span className="bg-brand-maroon-accent text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
                      -
                      {Math.round(
                        ((parseFloat(product.originalPrice) -
                          parseFloat(product.price)) /
                          parseFloat(product.originalPrice)) *
                          100,
                      )}
                      %
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 px-0.5">
                <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.2em]">
                  {product.brand || "Markrin Essentials"}
                </p>
                <h3 className="text-sm font-bold text-brand-dark-brown uppercase tracking-tight group-hover:text-brand-gold transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  <p className="text-brand-text font-black text-base">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  {product.originalPrice && (
                    <p className="text-gray-400 text-xs line-through font-medium">
                      ${parseFloat(product.originalPrice).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ProductGrid;
