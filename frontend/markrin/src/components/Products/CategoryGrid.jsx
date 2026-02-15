import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";

const categories = [
    {
        name: "Oversized",
        label: "Bold Fits",
        image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&q=80",
        path: "/collection/oversized",
    },
    {
        name: "Hoodies",
        label: "Stay Cozy",
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
        path: "/collection/hoodie",
    },
    {
        name: "Sweatshirts",
        label: "Warm & Stylish",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
        path: "/collection/sweat-shirt",
    },
    {
        name: "T-Shirts",
        label: "Classic Tees",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
        path: "/collection/normal-tshirt",
    },
    {
        name: "Men",
        label: "For Him",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
        path: "/collection/men",
    },
    {
        name: "Women",
        label: "For Her",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
        path: "/collection/women",
    },
];

function CategoryGrid() {
    return (
        <section className="py-10 lg:py-14 px-4 lg:px-8 bg-white">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-brand-dark-brown tracking-tight">
                            Shop by Category
                        </h2>
                        <p className="text-sm text-gray-400 mt-1.5">
                            Find exactly what you're looking for
                        </p>
                    </div>
                    <Link
                        to="/shop"
                        className="hidden sm:flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-wider hover:text-brand-dark-brown transition-colors group"
                    >
                        View All
                        <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 lg:gap-4">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.name}
                            to={cat.path}
                            className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Image */}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                loading="lazy"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4">
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold mb-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    {cat.label}
                                </p>
                                <h3 className="text-sm lg:text-base font-bold text-white leading-tight">
                                    {cat.name}
                                </h3>
                            </div>

                            {/* Hover arrow */}
                            <div className="absolute top-3 right-3 w-7 h-7 bg-white/0 rounded-full flex items-center justify-center group-hover:bg-white/90 transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100">
                                <HiArrowRight className="w-3.5 h-3.5 text-brand-dark-brown" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="flex sm:hidden justify-center mt-6">
                    <Link
                        to="/shop"
                        className="flex items-center gap-2 px-6 py-2.5 border border-brand-gold/30 text-brand-gold text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                    >
                        View All Categories
                        <HiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CategoryGrid;
