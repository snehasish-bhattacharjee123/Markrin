import React, { useState } from "react";
import { HiOutlineEnvelope, HiOutlineSparkles } from "react-icons/hi2";
import { toast } from "sonner";

function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(
            "Thanks for subscribing! Check your email for exclusive offers."
        );
        setEmail("");
        setLoading(false);
    };

    return (
        <section className="py-20 lg:py-24 px-4 lg:px-8 bg-brand-cream relative overflow-hidden">
            {/* Decorative soft circles */}
            <div className="absolute top-1/4 left-10 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl" />

            <div className="container mx-auto relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/15 border border-brand-gold/20 text-brand-gold mb-6">
                        <HiOutlineEnvelope className="w-7 h-7" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark-brown mb-4 tracking-tight">
                        Join the Markrin Movement
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                        Subscribe to our newsletter and be the first to know about new
                        arrivals, exclusive deals, and style tips.
                    </p>

                    {/* Incentive Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold text-sm font-bold mb-8">
                        <HiOutlineSparkles className="w-4 h-4" />
                        Get 10% off your first order
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all shadow-sm text-brand-dark-brown"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-sm rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-50 whitespace-nowrap shadow-lg shadow-brand-dark-brown/10 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Subscribing...
                                </span>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </form>

                    {/* Privacy Note */}
                    <p className="text-[11px] text-gray-400 mt-4 tracking-wide">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Newsletter;
