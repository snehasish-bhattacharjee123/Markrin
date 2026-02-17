import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";

const collections = [
  {
    title: "UNISEX COLLECTION",
    subtitle: "Style for Everyone",
    description: "Premium streetwear designed for all. Versatile, comfortable, and effortlessly cool.",
    cta: "Shop Collection",
    link: "/collection/unisex",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80",
  },
];

function GenderCollection() {
  return (
    <section className="py-6 lg:py-8 px-4 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {collections.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="group relative rounded-2xl overflow-hidden h-[300px] sm:h-[400px] lg:h-[500px]"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Multi-layer Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12 items-start">
                {/* Subtitle */}
                <p className="text-xs uppercase tracking-[0.3em] text-brand-gold font-bold mb-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  {item.subtitle}
                </p>

                {/* Title */}
                <h3 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-none">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl leading-relaxed hidden sm:block">
                  {item.description}
                </p>

                {/* CTA */}
                <span className="inline-flex items-center gap-3 px-8 py-3.5 bg-white/95 text-brand-dark-brown text-sm font-bold uppercase tracking-wider rounded-xl group-hover:bg-brand-gold transition-all duration-300 w-fit shadow-lg transform group-hover:translate-x-1">
                  {item.cta}
                  <HiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GenderCollection;
