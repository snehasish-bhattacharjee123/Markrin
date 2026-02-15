import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineArrowLeft } from "react-icons/hi2";

function NotFound() {
    const location = useLocation();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-b from-brand-cream to-white">
            <div className="text-center max-w-lg">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[160px] lg:text-[200px] font-black text-brand-dark-brown/5 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center animate-bounce">
                                <svg className="w-10 h-10 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-2xl lg:text-3xl font-bold text-brand-dark-brown mb-3">
                    Page Not Found
                </h2>
                <p className="text-gray-500 mb-2 text-sm">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <p className="text-gray-400 text-xs mb-8 font-mono bg-gray-50 inline-block px-3 py-1 rounded-full">
                    {location.pathname}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 group"
                    >
                        <HiOutlineHome className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-dark-brown font-bold uppercase tracking-wider text-sm rounded-lg border-2 border-brand-dark-brown hover:bg-brand-dark-brown hover:text-white transition-all duration-300 group"
                    >
                        <HiOutlineShoppingBag className="w-4 h-4" />
                        Shop Now
                    </Link>
                </div>

                {/* Go Back */}
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-gold transition-colors cursor-pointer"
                >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Go back to previous page
                </button>
            </div>
        </div>
    );
}

export default NotFound;
