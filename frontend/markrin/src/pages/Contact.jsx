import React, { useState } from "react";
import {
    HiOutlineMapPin,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineClock
} from "react-icons/hi2";
import { TbBrandFacebook, TbBrandInstagram } from "react-icons/tb";
import { toast } from "sonner";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Hero Section */}
            <section className="bg-brand-dark-brown py-20 text-center">
                <div className="container mx-auto px-6">
                    <span className="inline-block px-4 py-2 bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-4">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto">
                        Have a question, feedback, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="py-20 px-4 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-brand-dark-brown mb-6">
                                Send us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                                        Subject
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                                        required
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="order">Order Support</option>
                                        <option value="returns">Returns & Refunds</option>
                                        <option value="wholesale">Wholesale Inquiry</option>
                                        <option value="feedback">Feedback</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us how we can help..."
                                        rows={5}
                                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            {/* Info Cards */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0">
                                    <HiOutlineMapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark-brown mb-1">Our Address</h3>
                                    <p className="text-gray-600">
                                        64/3 Nabin Senapati Lane<br />
                                        Howrah - 711101<br />
                                        West Bengal, India
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0">
                                    <HiOutlinePhone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark-brown mb-1">Phone Number</h3>
                                    <p className="text-gray-600">
                                        <a href="tel:+919875540545" className="hover:text-brand-gold transition-colors">
                                            +91 98755 40545
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0">
                                    <HiOutlineEnvelope className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark-brown mb-1">Email Address</h3>
                                    <p className="text-gray-600">
                                        <a href="mailto:support@markrin.com" className="hover:text-brand-gold transition-colors">
                                            support@markrin.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0">
                                    <HiOutlineClock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark-brown mb-1">Business Hours</h3>
                                    <p className="text-gray-600">
                                        Monday - Saturday: 10:00 AM - 7:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-brand-dark-brown p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61581277903401"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                                    >
                                        <TbBrandFacebook className="w-6 h-6" />
                                    </a>
                                    <a
                                        href="https://instagram.com/markrin1015/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                                    >
                                        <TbBrandInstagram className="w-6 h-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 lg:px-8 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-brand-dark-brown mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600">
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "What is your return policy?",
                                a: "We offer a 30-day hassle-free return policy on all unworn items with original tags. Simply contact our support team to initiate a return.",
                            },
                            {
                                q: "How long does shipping take?",
                                a: "Domestic orders are delivered within 3-7 business days. International shipping typically takes 7-14 business days depending on the destination.",
                            },
                            {
                                q: "Do you ship internationally?",
                                a: "Yes! We ship worldwide. Shipping costs and delivery times vary by location. Free shipping on orders over $100.",
                            },
                            {
                                q: "How can I track my order?",
                                a: "Once your order ships, you'll receive an email with tracking information. You can also track your order from your account page.",
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit/debit cards, UPI, Net Banking, and Cash on Delivery (COD) for eligible orders.",
                            },
                        ].map((faq, index) => (
                            <details
                                key={index}
                                className="bg-white p-6 rounded-xl border border-gray-100 group"
                            >
                                <summary className="font-bold text-brand-dark-brown cursor-pointer list-none flex justify-between items-center">
                                    {faq.q}
                                    <span className="text-brand-gold group-open:rotate-180 transition-transform">
                                        ▼
                                    </span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
