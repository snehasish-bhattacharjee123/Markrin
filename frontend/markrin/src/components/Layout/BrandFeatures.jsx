import React from "react";
import {
    HiOutlineTruck,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineArrowPath,
} from "react-icons/hi2";

const features = [
    {
        icon: HiOutlineTruck,
        title: "Free Shipping",
        description: "Free delivery on orders over ₹999. Get it in 3-7 business days.",
    },
    {
        icon: HiOutlineShieldCheck,
        title: "Premium Quality",
        description: "100% authentic products. Quality guaranteed on every item.",
    },
    {
        icon: HiOutlineCreditCard,
        title: "Secure Payment",
        description: "Multiple payment options. Your transactions are always safe.",
    },
    {
        icon: HiOutlineArrowPath,
        title: "Easy Returns",
        description: "7-day hassle-free returns on unworn items. No questions asked.",
    },
];

function BrandFeatures() {
    return (
        <section className="py-16 lg:py-20 px-4 lg:px-8 bg-brand-dark-brown relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto relative z-10">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-3">
                        Why Choose Us
                    </p>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        The Markrin Promise
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center group cursor-default"
                        >
                            {/* Icon Container */}
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold mb-5 group-hover:bg-brand-gold group-hover:text-brand-dark-brown group-hover:border-brand-gold transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-gold/20">
                                <feature.icon className="w-7 h-7" />
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-white/50 leading-relaxed max-w-[200px] mx-auto">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BrandFeatures;
