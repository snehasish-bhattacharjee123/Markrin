import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";

function Banner() {
  return (
    <section className="py-6 lg:py-8 px-4 lg:px-8 bg-brand-cream">
      <div className="container mx-auto">
        <Link
          to="/collection/oversized"
          className="group relative block rounded-2xl overflow-hidden h-56 sm:h-64 lg:h-80"
        >
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
            alt="Oversized Collection"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-brown/90 via-brand-dark-brown/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-8 lg:px-16">
            <div className="max-w-lg">
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-3">
                Limited Edition
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight leading-tight">
                Street Ready
                <br />
                Collection
              </h2>
              <p className="text-sm text-white/60 mb-6 max-w-sm hidden sm:block">
                Bold designs meet premium comfort. Every piece tells a story.
                Be part of the movement.
              </p>
              <span className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-gold text-brand-dark-brown font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-white transition-all duration-300 shadow-lg shadow-brand-gold/20 group-hover:shadow-xl">
                Shop Now
                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default Banner;
