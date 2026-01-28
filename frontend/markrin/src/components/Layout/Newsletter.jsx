import React, { useState } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { toast } from "sonner";

function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Thanks for subscribing! Check your email for exclusive offers.");
        setEmail("");
        setLoading(false);
    };

    return (
        <section className="py-20 px-4 lg:px-8 bg-brand-cream">
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/20 text-brand-gold mb-6">
                        <HiOutlineEnvelope className="w-8 h-8" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark-brown mb-4">
                        Join the Markrin Movement
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Subscribe to our newsletter and be the first to know about new arrivals,
                        exclusive deals, and style tips. Get 10% off your first order!
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow px-6 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                        >
                            {loading ? "Subscribing..." : "Subscribe"}
                        </button>
                    </form>

                    {/* Privacy Note */}
                    <p className="text-xs text-gray-400 mt-4">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Newsletter;
