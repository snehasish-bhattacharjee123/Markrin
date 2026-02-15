import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex === slides.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, goToSlide, slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[75vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Background Slides with Ken Burns Effect */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${index === activeIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === activeIndex ? "scale-110" : "scale-100"
              }`}
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Multi-layer overlay for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex items-center px-6 lg:px-12">
        <div className="max-w-2xl">
          {/* Subtitle Badge */}
          <div
            key={`subtitle-${activeIndex}`}
            className="inline-block mb-5 animate-[fadeInUp_0.6s_ease-out_0.1s_both]"
          >
            <span className="px-4 py-2 bg-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] rounded-full backdrop-blur-sm border border-brand-gold/30 shadow-lg shadow-brand-gold/5">
              {slides[activeIndex].subtitle}
            </span>
          </div>

          {/* Main Title */}
          <h1
            key={`title-${activeIndex}`}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-5 leading-[1.05] tracking-tight animate-[fadeInUp_0.6s_ease-out_0.2s_both]"
          >
            {slides[activeIndex].title}
          </h1>

          {/* Description */}
          <p
            key={`desc-${activeIndex}`}
            className="text-base sm:text-lg md:text-xl text-white/75 mb-8 max-w-lg leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.35s_both]"
          >
            {slides[activeIndex].description}
          </p>

          {/* CTA Buttons */}
          <div
            key={`cta-${activeIndex}`}
            className="flex flex-wrap gap-4 animate-[fadeInUp_0.6s_ease-out_0.5s_both]"
          >
            <Link
              to={slides[activeIndex].link}
              className="group px-8 py-4 bg-brand-gold text-brand-dark-brown font-bold uppercase tracking-[0.15em] text-sm rounded-xl hover:bg-white transition-all duration-300 shadow-xl shadow-brand-gold/20 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {slides[activeIndex].cta}
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              to="/collection/new-arrivals"
              className="px-8 py-4 border-2 border-white/40 text-white font-bold uppercase tracking-[0.15em] text-sm rounded-xl hover:bg-white hover:text-brand-dark-brown hover:border-white transition-all duration-300 backdrop-blur-sm"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-500 ${index === activeIndex
                ? "w-10 h-1.5 bg-brand-gold shadow-md shadow-brand-gold/30"
                : "w-5 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter - Right Side */}
      <div className="absolute bottom-8 sm:bottom-10 right-6 lg:right-12 z-20 text-white/50 text-xs font-bold tracking-wider">
        <span className="text-white text-base">{String(activeIndex + 1).padStart(2, "0")}</span>
        <span className="mx-1.5">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 sm:bottom-10 right-6 lg:right-12 z-20 hidden lg:flex flex-col items-center translate-y-[-100px]">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-3 [writing-mode:vertical-lr]">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 w-full bg-brand-gold/60 animate-[scrollIndicator_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scrollIndicator {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
