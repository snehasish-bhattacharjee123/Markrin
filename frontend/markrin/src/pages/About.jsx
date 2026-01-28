import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles, HiOutlineHeart, HiOutlineUserGroup } from "react-icons/hi2";

function About() {
    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
                    alt="About Markrin"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-6 lg:px-12">
                        <span className="inline-block px-4 py-2 bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.25em] rounded-full backdrop-blur-sm border border-brand-gold/30 mb-4">
                            Our Story
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
                            About Markrin
                        </h1>
                        <p className="text-xl text-white/80 max-w-xl">
                            Feel the Soul of Art. We craft premium streetwear for the modern, confident individual.
                        </p>
                    </div>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-20 px-4 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block px-4 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-6">
                                The Beginning
                            </span>
                            <h2 className="text-4xl font-bold text-brand-dark-brown mb-6">
                                Born from Passion, Built for Expression
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Markrin was founded with a simple yet powerful vision: to create clothing that doesn't just cover, but expresses. We believe that what you wear is an extension of who you are—your personality, your values, your art.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Based in Howrah, India, we started as a small team of designers and dreamers who wanted to bring premium streetwear to the modern generation. Every piece we create is a canvas for self-expression, designed for those who dare to stand out.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Today, we ship worldwide, but our mission remains the same: to help you <strong>"Feel the Soul of Art"</strong> in everything you wear.
                            </p>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800"
                                alt="Our Story"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-brand-gold p-6 rounded-2xl shadow-xl">
                                <p className="text-3xl font-bold text-brand-dark-brown">2026</p>
                                <p className="text-sm text-brand-dark-brown/80">Est.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 lg:px-8 bg-brand-dark-brown">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                            Our Values
                        </span>
                        <h2 className="text-4xl font-bold text-white">
                            What We Stand For
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/20 text-brand-gold mb-6">
                                <HiOutlineSparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Premium Quality</h3>
                            <p className="text-white/70">
                                We source the finest materials and partner with skilled craftsmen to create pieces that last.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/20 text-brand-gold mb-6">
                                <HiOutlineHeart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Authentic Design</h3>
                            <p className="text-white/70">
                                Every design tells a story. We create original artwork that resonates with the modern generation.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/20 text-brand-gold mb-6">
                                <HiOutlineUserGroup className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Community First</h3>
                            <p className="text-white/70">
                                We're building more than a brand—we're building a movement of confident, creative individuals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team / Founder */}
            <section className="py-20 px-4 lg:px-8">
                <div className="container mx-auto">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block px-4 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-6">
                            Brand Voice
                        </span>
                        <h2 className="text-4xl font-bold text-brand-dark-brown mb-8">
                            Modern • Confident • Youthful • Premium-Accessible
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed mb-12">
                            "We don't just sell clothes. We sell confidence. We sell expression.
                            We sell the feeling of putting on something that truly represents who you are.
                            That's the soul of art—and that's what Markrin is all about."
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300"
                        >
                            Explore Our Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4 lg:px-8 bg-gray-50">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-brand-gold mb-2">10K+</p>
                            <p className="text-gray-600 uppercase tracking-wider text-sm">Happy Customers</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand-gold mb-2">50+</p>
                            <p className="text-gray-600 uppercase tracking-wider text-sm">Unique Designs</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand-gold mb-2">15+</p>
                            <p className="text-gray-600 uppercase tracking-wider text-sm">Countries Shipped</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand-gold mb-2">4.9★</p>
                            <p className="text-gray-600 uppercase tracking-wider text-sm">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
