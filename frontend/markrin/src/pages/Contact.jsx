import React, { useState } from "react";
import {
    HiOutlineMapPin,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineClock,
    HiArrowRight,
    HiPaperAirplane,
} from "react-icons/hi2";
import {
    TbBrandFacebook,
    TbBrandInstagram,
    TbBrandWhatsapp,
} from "react-icons/tb";
import { toast } from "sonner";

const storeLocations = [
    {
        city: "Howrah",
        address: "64/3 Nabin Senapati Lane, Howrah - 711101, West Bengal",
        phone: "+91 98755 40545",
        hours: {
            weekday: "Mon - Sat: 10:00 AM – 7:00 PM",
            weekend: "Sunday: Closed",
        },
        mapUrl: "https://maps.google.com/?q=64/3+Nabin+Senapati+Lane+Howrah+711101",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    },
];

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setLoading(false);
    };

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const faqs = [
        {
            q: "What is your return policy?",
            a: "We offer a 7-day hassle-free return policy on all unworn items with original tags. Simply contact our support team to initiate a return.",
        },
        {
            q: "How long does shipping take?",
            a: "Domestic orders are delivered within 3-7 business days. International shipping typically takes 7-14 business days depending on the destination.",
        },
        {
            q: "Do you ship internationally?",
            a: "Yes! We ship worldwide. Shipping costs and delivery times vary by location. Free shipping on orders over ₹1000.",
        },
        {
            q: "How can I track my order?",
            a: "Once your order ships, you'll receive an email with tracking information. You can also track your order from your profile page.",
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit/debit cards, UPI, Net Banking, and Cash on Delivery (COD) for eligible orders.",
        },
        {
            q: "Can I modify or cancel my order?",
            a: "Orders can be modified or cancelled within 2 hours of placement. After that, please contact our support team for assistance.",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-brand-dark-brown py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,167,110,0.4),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(201,167,110,0.2),transparent_60%)]" />
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="inline-block px-5 py-1.5 bg-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-5">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                        Contact Us
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
                        Have a question, feedback, or just want to say hello? We'd love to hear from you.
                        Our team is here to help.
                    </p>
                </div>
            </section>

            {/* Quick Contact Strip */}
            <section className="bg-brand-cream border-b border-brand-gold/10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-gold/20">
                        <a
                            href="https://wa.me/919875540545"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-6 lg:p-8 hover:bg-brand-gold/5 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                                <TbBrandWhatsapp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-dark-brown text-sm uppercase tracking-wider mb-0.5">WhatsApp Us</h3>
                                <p className="text-gray-500 text-sm">+91 98755 40545</p>
                            </div>
                        </a>
                        <a
                            href="tel:+919875540545"
                            className="flex items-center gap-4 p-6 lg:p-8 hover:bg-brand-gold/5 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <HiOutlinePhone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-dark-brown text-sm uppercase tracking-wider mb-0.5">Call Us</h3>
                                <p className="text-gray-500 text-sm">+91 98755 40545</p>
                            </div>
                        </a>
                        <a
                            href="mailto:support@markrin.com"
                            className="flex items-center gap-4 p-6 lg:p-8 hover:bg-brand-gold/5 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-all">
                                <HiOutlineEnvelope className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-dark-brown text-sm uppercase tracking-wider mb-0.5">Mail Us</h3>
                                <p className="text-gray-500 text-sm">support@markrin.com</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Form + Info */}
            <section className="py-16 lg:py-24 px-4 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="mb-8">
                                <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-3">
                                    Send a Message
                                </span>
                                <h2 className="text-3xl font-bold text-brand-dark-brown mb-2">
                                    Get in Touch
                                </h2>
                                <p className="text-gray-500">
                                    Fill out the form below and we'll get back to you within 24 hours.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dark-brown mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold focus:bg-white transition-all text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dark-brown mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold focus:bg-white transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dark-brown mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold focus:bg-white transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dark-brown mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold focus:bg-white transition-all text-sm"
                                            required
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="order">Order Support</option>
                                            <option value="returns">Returns & Refunds</option>
                                            <option value="wholesale">Wholesale / Bulk Order</option>
                                            <option value="corporate">Corporate Orders</option>
                                            <option value="feedback">Feedback</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dark-brown mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us how we can help..."
                                        rows={5}
                                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold focus:bg-white transition-all resize-none text-sm"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-50 group"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <HiPaperAirplane className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right Side Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Info Cards */}
                            <div className="bg-brand-cream rounded-2xl p-6 space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0">
                                        <HiOutlineMapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-dark-brown text-sm mb-1">Address</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            64/3 Nabin Senapati Lane<br />
                                            Howrah - 711101<br />
                                            West Bengal, India
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-brand-gold/10" />

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0">
                                        <HiOutlineClock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-dark-brown text-sm mb-1">Business Hours</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Monday - Saturday: 10:00 AM - 7:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links Card */}
                            <div className="bg-brand-dark-brown rounded-2xl p-6">
                                <h3 className="font-bold text-white mb-1 text-sm">Follow Us</h3>
                                <p className="text-white/50 text-xs mb-4">Stay updated with our latest collections</p>
                                <div className="flex gap-3">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61581277903401"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark-brown transition-all hover:scale-105"
                                    >
                                        <TbBrandFacebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="https://instagram.com/markrin1015/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark-brown transition-all hover:scale-105"
                                    >
                                        <TbBrandInstagram className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="https://wa.me/919875540545"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-green-500 hover:text-white transition-all hover:scale-105"
                                    >
                                        <TbBrandWhatsapp className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            {/* Map / Directions */}
                            <a
                                href={storeLocations[0].mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <div className="relative overflow-hidden rounded-2xl h-48">
                                    <img
                                        src={storeLocations[0].image}
                                        alt="Store Location"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <p className="text-white font-bold text-sm mb-1">Visit Our Store</p>
                                        <span className="inline-flex items-center gap-1 text-brand-gold text-xs font-bold uppercase tracking-wider">
                                            Get Directions <HiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 lg:py-20 px-4 lg:px-8 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
                            FAQ
                        </span>
                        <h2 className="text-3xl font-bold text-brand-dark-brown mb-3">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-500">
                            Quick answers to common questions about our products and services
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-sm"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex justify-between items-center p-5 text-left"
                                >
                                    <span className="font-bold text-brand-dark-brown text-sm pr-4">
                                        {faq.q}
                                    </span>
                                    <span
                                        className={`flex-shrink-0 w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold transition-transform duration-300 ${activeAccordion === index ? "rotate-180" : ""
                                            }`}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${activeAccordion === index ? "max-h-40 pb-5" : "max-h-0"
                                        }`}
                                >
                                    <p className="px-5 text-gray-600 text-sm leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
