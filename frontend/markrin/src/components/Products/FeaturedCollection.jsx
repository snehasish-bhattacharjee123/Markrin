import React from "react";
import { Link } from "react-router-dom";

function FeaturedCollection() {
  return (
    <section className="py-16 px-4 lg:px-0 bg-brand-cream">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-brand-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        {/* Left Content Container */}
        <div className="lg:w-1/2 p-8 md:p-16 text-center lg:text-left">
          <h3 className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">
            Comfort and Style
          </h3>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-brand-dark-brown leading-tight">
            Apparel made for your everyday life
          </h2>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Discover our exclusive featured collection, curated to bring you the
            latest trends and timeless styles. Each piece is selected for its
            quality, design, and versatility, ensuring you find something
            special for every occasion.
          </p>

          <Link
            to="/collections/all"
            className="inline-block bg-brand-dark-brown text-brand-white px-10 py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 shadow-lg shadow-brand-dark-brown/10"
          >
            Shop the Collection
          </Link>
        </div>

        {/* Right Image Container */}
        <div className="lg:w-1/2 w-full h-[400px] lg:h-[600px]">
          <img
            src="https://images.unsplash.com"
            alt="Featured Collection"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
