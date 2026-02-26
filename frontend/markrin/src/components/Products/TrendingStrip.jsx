import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight, HiOutlineFire, HiOutlineSparkles, HiOutlineBolt } from "react-icons/hi2";

const trends = [
    {
        title: "Best Picks",
        subtitle: "Top rated styles",
        icon: HiOutlineFire,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
        link: "/shop?sortBy=rating",
    },
    {
        title: "New Launches",
        subtitle: "Just dropped today",
        icon: HiOutlineSparkles,
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80",
        link: "/collection/new-arrivals",
    },
    {
        title: "Trending Now",
        subtitle: "What's hot right now",
        icon: HiOutlineBolt,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80",
        link: "/shop?sortBy=popularity",
    },
];

function TrendingStrip() {
    return (
        <section className="py-6 lg:py-8 px-4 lg:px-8 bg-brand-cream">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {trends.map((trend) => (
                        <Link
                            key={trend.title}
                            to={trend.link}
                            className="group relative flex items-center gap-5 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                <img
                                    src={trend.image}
                                    alt={trend.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <trend.icon className="w-4 h-4 text-brand-gold" />
                                    <h3 className="font-bold text-brand-dark-brown text-sm uppercase tracking-wider">
                                        {trend.title}
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-400">{trend.subtitle}</p>
                            </div>

                            {/* Arrow */}
                            <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TrendingStrip;
