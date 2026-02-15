import React from "react";
import logoImage from "../../assets/final_logo_cc_website.svg";

const Loader = ({ fullScreen = true, size = "w-24" }) => {
    return (
        <div
            className={`${fullScreen
                    ? "fixed inset-0 min-h-screen bg-brand-cream/80 backdrop-blur-sm z-50"
                    : "w-full py-20"
                } flex flex-col items-center justify-center`}
        >
            <div className="relative flex flex-col items-center gap-4">
                {/* Animated Rings */}
                <div className="absolute inset-0 -m-8">
                    <div className="w-full h-full border-4 border-brand-gold/20 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
                </div>
                <div className="absolute inset-0 -m-8">
                    <div className="w-full h-full border-4 border-brand-dark-brown/10 rounded-full animate-[ping_3s_ease-in-out_infinite_0.5s]" />
                </div>

                {/* Logo Container with pulse */}
                <div className={`relative ${size} aspect-video animate-pulse`}>
                    <img
                        src={logoImage}
                        alt="Loading..."
                        className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                </div>

                {/* Loading Text with typing effect or fade */}
                <div className="mt-4 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-dark-brown animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-brand-maroon-accent animate-bounce"></span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
