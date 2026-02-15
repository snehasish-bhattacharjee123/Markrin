import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";

const banners = [
    {
        id: 1,
        title: "OVERSIZED",
        subtitle: "COLLECTION",
        description: "Bold fits for the bold ones",
        cta: "Shop Now",
        link: "/collection/oversized",
        image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=1200&q=80",
        align: "left",
    },
    {
        id: 2,
        title: "HOODIES",
        subtitle: "& SWEATSHIRTS",
        description: "Stay warm, stay stylish",
        cta: "Explore",
        link: "/collection/hoodie",
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=80",
        align: "right",
    },
];

function PromoBanners() {
    return (
        <section className="py-6 lg:py-8 px-4 lg:px-8 bg-white">
            <div className="container mx-auto space-y-4">
                {banners.map((banner) => (
                    <Link
                        key={banner.id}
                        to={banner.link}
                        className="group relative block rounded-2xl overflow-hidden h-48 lg:h-64"
                    >
                        {/* Background Image */}
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            loading="lazy"
                        />

                        {/* Gradient Overlay */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-${banner.align === "left" ? "r" : "l"
                                } from-black/75 via-black/40 to-transparent transition-all duration-500`}
                        />

                        {/* Content */}
                        <div
                            className={`absolute inset-0 flex items-center ${banner.align === "right" ? "justify-end" : "justify-start"
                                } p-8 lg:p-16`}
                        >
                            <div
                                className={`${banner.align === "right" ? "text-right" : "text-left"
                                    }`}
                            >
                                <h3 className="text-3xl lg:text-5xl font-black text-white mb-1 tracking-tight leading-none">
                                    {banner.title}
                                </h3>
                                <p className="text-xl lg:text-2xl font-light text-white/60 mb-2">
                                    {banner.subtitle}
                                </p>
                                <p className="text-sm text-white/50 mb-5">
                                    {banner.description}
                                </p>
                                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 text-brand-dark-brown text-sm font-bold uppercase tracking-wider rounded-xl group-hover:bg-brand-gold transition-all duration-300 shadow-lg">
                                    {banner.cta}
                                    <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default PromoBanners;
