import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600",
      title: "FEEL THE SOUL OF ART",
      subtitle: "New Collection 2026",
      description: "Discover premium streetwear that defines your unique style. Bold designs for the modern generation.",
      cta: "Shop Collection",
      link: "/collection/all",
    },
    {
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600",
      title: "GRAPHIC TEES",
      subtitle: "Express Yourself",
      description: "Artistic prints that speak volumes. Stand out from the crowd with our exclusive graphic collection.",
      cta: "Explore Now",
      link: "/collection/graphic-tees",
    },
    {
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600",
      title: "MEN'S COLLECTION",
      subtitle: "Premium Quality",
      description: "Crafted for comfort, designed for impact. Elevate your wardrobe with timeless essentials.",
      cta: "Shop Men",
      link: "/collection/men",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex items-center px-6 lg:px-12">
        <div className="max-w-2xl">
          {/* Subtitle Badge */}
          <div
            className={`inline-block mb-4 transform transition-all duration-700 ${true ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <span className="px-4 py-2 bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.25em] rounded-full backdrop-blur-sm border border-brand-gold/30">
              {slides[activeIndex].subtitle}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            {slides[activeIndex].title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
            {slides[activeIndex].description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={slides[activeIndex].link}
              className="px-8 py-4 bg-brand-gold text-brand-dark-brown font-bold uppercase tracking-widest text-sm hover:bg-white transition-all duration-300 shadow-lg shadow-brand-gold/20"
            >
              {slides[activeIndex].cta}
            </Link>
            <Link
              to="/collection/new-arrivals"
              className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-brand-dark-brown transition-all duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex
                ? "w-12 bg-brand-gold"
                : "w-6 bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 right-10 z-20 hidden lg:flex flex-col items-center">
        <span className="text-white/60 text-xs uppercase tracking-widest mb-2 rotate-90 origin-center translate-y-8">
          Scroll
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;
