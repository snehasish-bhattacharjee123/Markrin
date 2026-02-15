import React from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineShoppingBag,
    HiOutlineSparkles,
    HiOutlineFire,
    HiOutlineSquaresPlus
} from "react-icons/hi2";

const categories = [
    {
        id: 1,
        name: "Oversized",
        description: "Bold streetwear fits",
        icon: HiOutlineSquaresPlus,
        image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600",
        path: "/collection/oversized",
        color: "from-purple-500 to-pink-500",
    },
    {
        id: 2,
        name: "Sweat Shirt",
        description: "Cozy & stylish",
        icon: HiOutlineFire,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        path: "/collection/sweat-shirt",
        color: "from-orange-500 to-red-500",
    },
    {
        id: 3,
        name: "Hoodie",
        description: "Warm & comfortable",
        icon: HiOutlineSparkles,
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600",
        path: "/collection/hoodie",
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: 4,
        name: "Normal T-Shirt",
        description: "Everyday essentials",
        icon: HiOutlineShoppingBag,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        path: "/collection/normal-tshirt",
        color: "from-brand-gold to-yellow-500",
    },
];

function FeaturedCategories() {
    return (
        <section className="py-16 px-4 lg:px-8 bg-brand-cream">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                        Collections
                    </span>
                    <h2 className="text-4xl font-bold text-brand-dark-brown mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover our curated collections designed for the modern, confident individual.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.path}
                            className="group relative overflow-hidden rounded-2xl h-64 lg:h-80"
                        >
                            {/* Background Image */}
                            <img
                                src={category.image}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                <category.icon className="w-8 h-8 mb-3 transform group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl lg:text-2xl font-bold mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {category.description}
                                </p>
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedCategories;
