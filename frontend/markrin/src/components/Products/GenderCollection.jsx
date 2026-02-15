import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";

const collections = [
  {
    title: "MEN",
    subtitle: "Bold & Confident",
    description: "Premium streetwear designed for the modern man. Stand out with effortless style.",
    cta: "Shop Men",
    link: "/collection/men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
  },
  {
    title: "WOMEN",
    subtitle: "Elegant & Fierce",
    description: "Fashion that empowers. Express your unique identity with our curated collection.",
    cta: "Shop Women",
    link: "/collection/women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
];

function GenderCollection() {
  return (
    <section className="py-6 lg:py-8 px-4 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {collections.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="group relative rounded-2xl overflow-hidden h-[280px] sm:h-[340px] lg:h-[420px]"
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
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                {/* Subtitle */}
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  {item.subtitle}
                </p>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight leading-none">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/60 mb-5 max-w-xs leading-relaxed hidden sm:block">
                  {item.description}
                </p>

                {/* CTA */}
                <span className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/95 text-brand-dark-brown text-sm font-bold uppercase tracking-wider rounded-xl group-hover:bg-brand-gold transition-all duration-300 w-fit shadow-lg transform group-hover:translate-x-1">
                  {item.cta}
                  <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
