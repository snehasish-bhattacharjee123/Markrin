import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { productsAPI } from "../../api";

function NewArrivals() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await productsAPI.getNewArrivals();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        // Fallback mock data
        setProducts([
          {
            _id: "1",
            name: "Classic White T-Shirt",
            price: 29.99,
            images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", altText: "White T-shirt" }],
          },
          {
            _id: "2",
            name: "Black Graphic Tee",
            price: 34.99,
            images: [{ url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500", altText: "Black graphic t-shirt" }],
          },
          {
            _id: "3",
            name: "Casual Blue T-Shirt",
            price: 19.99,
            images: [{ url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500", altText: "Blue casual t-shirt" }],
          },
          {
            _id: "4",
            name: "Oversized Streetwear Tee",
            price: 49.99,
            images: [{ url: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500", altText: "Oversized streetwear" }],
          },
          {
            _id: "5",
            name: "Minimal Grey T-Shirt",
            price: 24.99,
            images: [{ url: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=500", altText: "Grey minimal" }],
          },
          {
            _id: "6",
            name: "Printed Fashion Tee",
            price: 59.99,
            images: [{ url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", altText: "Printed fashion" }],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto">
          <div className="animate-pulse flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[280px]">
                <div className="bg-gray-200 h-80 rounded-xl mb-4" />
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
                <div className="bg-gray-200 h-4 w-1/4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 lg:px-0 bg-white">
      <div className="container mx-auto relative mb-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block px-4 py-1 bg-green-100 text-green-600 text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-3">
              Just Dropped
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark-brown">New Arrivals</h2>
            <p className="text-gray-600 mt-2">
              Explore the latest additions to our collection.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 border border-gray-200 rounded-full bg-white hover:bg-brand-dark-brown hover:text-white hover:border-brand-dark-brown transition-all shadow-sm"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 border border-gray-200 rounded-full bg-white hover:bg-brand-dark-brown hover:text-white hover:border-brand-dark-brown transition-all shadow-sm"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div
        ref={scrollRef}
        className="container mx-auto flex space-x-6 overflow-x-auto scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="flex-shrink-0 w-[280px] group"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={product.images?.[0]?.url || "https://via.placeholder.com/280x320"}
                alt={product.images?.[0]?.altText || product.name}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* New Badge */}
              <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase rounded-full">
                New
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-brand-dark-brown group-hover:text-brand-gold transition-colors">
                {product.name}
              </h3>
              <p className="text-brand-gold font-bold mt-1">
                ${product.price?.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="container mx-auto mt-8 text-center">
        <Link
          to="/collection/new-arrivals"
          className="inline-block px-8 py-3 border-2 border-brand-dark-brown text-brand-dark-brown font-bold uppercase tracking-wider text-sm hover:bg-brand-dark-brown hover:text-white transition-all duration-300"
        >
          View All New Arrivals
        </Link>
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default NewArrivals;
