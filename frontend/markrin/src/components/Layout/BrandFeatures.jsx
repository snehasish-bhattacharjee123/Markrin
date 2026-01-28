import React from "react";
import {
    HiOutlineTruck,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineArrowPath
} from "react-icons/hi2";

const features = [
    {
        icon: HiOutlineTruck,
        title: "Worldwide Shipping",
        description: "Free shipping on orders over $100. Delivery in 3-7 business days.",
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
        description: "30-day hassle-free returns on unworn items. No questions asked.",
    },
];

function BrandFeatures() {
    return (
        <section className="py-16 px-4 lg:px-8 bg-brand-dark-brown">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/20 text-brand-gold mb-4 group-hover:bg-brand-gold group-hover:text-brand-dark-brown transition-all duration-300">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-white/70 leading-relaxed">
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
