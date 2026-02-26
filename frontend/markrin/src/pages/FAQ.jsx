import React, { useState } from "react";
import { HiOutlineChevronDown, HiOutlineMagnifyingGlass } from "react-icons/hi2";

const faqData = [
    {
        category: "Orders & Shipping",
        faqs: [
            {
                q: "How long does shipping take?",
                a: "Domestic orders are delivered within 3-7 business days. International shipping typically takes 7-14 business days depending on the destination. Express shipping options are available at checkout for faster delivery.",
            },
            {
                q: "Do you ship internationally?",
                a: "Yes! We ship worldwide to over 100 countries. Shipping costs and delivery times vary by location. Free shipping is available on orders over ₹2,000 for domestic and ₹5,000 for international orders.",
            },
            {
                q: "How can I track my order?",
                a: "Once your order ships, you'll receive an email with tracking information. You can also track your order from your account page under 'Order History'. Simply click on any order to view its current status and tracking details.",
            },
            {
                q: "Can I change or cancel my order?",
                a: "You can modify or cancel your order within 2 hours of placing it. After that, orders enter processing and cannot be changed. Please contact our support team immediately if you need to make changes.",
            },
            {
                q: "What if my order arrives damaged?",
                a: "We take great care in packaging all orders. If your item arrives damaged, please contact us within 48 hours with photos of the damage. We'll arrange a replacement or full refund at no additional cost to you.",
            },
        ],
    },
    {
        category: "Returns & Refunds",
        faqs: [
            {
                q: "What is your return policy?",
                a: "We offer a 30-day hassle-free return policy on all unworn items with original tags attached. Items must be in their original condition. Simply contact our support team to initiate a return and receive a prepaid shipping label.",
            },
            {
                q: "How do I initiate a return?",
                a: "To start a return, log into your account and go to 'Order History'. Select the order containing the item you wish to return and click 'Request Return'. You can also email our support team at returns@markrin.com.",
            },
            {
                q: "How long do refunds take?",
                a: "Once we receive your return, refunds are processed within 3-5 business days. The amount will be credited back to your original payment method. Please allow an additional 5-10 business days for the refund to appear in your account.",
            },
            {
                q: "Can I exchange an item for a different size?",
                a: "Yes! We offer free exchanges for different sizes within 30 days of purchase. Contact our support team to arrange an exchange. We'll ship the new size as soon as we receive your return.",
            },
        ],
    },
    {
        category: "Payment & Security",
        faqs: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, PayPal, and Cash on Delivery (COD) for eligible Indian orders. All transactions are secured with SSL encryption.",
            },
            {
                q: "Is my payment information secure?",
                a: "Absolutely! We use industry-standard SSL encryption and never store your complete payment details on our servers. All payments are processed through secure, PCI-compliant payment gateways.",
            },
            {
                q: "Do you offer EMI options?",
                a: "Yes, we offer EMI options on orders above ₹3,000 through select bank cards. EMI options will be displayed at checkout if your card is eligible. No-cost EMI is available on select products.",
            },
            {
                q: "Why was my payment declined?",
                a: "Payments may be declined due to incorrect card details, insufficient funds, or bank security measures. Please verify your information and try again. If the issue persists, contact your bank or try an alternative payment method.",
            },
        ],
    },
    {
        category: "Products & Sizing",
        faqs: [
            {
                q: "How do I find my correct size?",
                a: "Each product page includes a detailed size chart with measurements. We recommend measuring yourself and comparing to our charts for the best fit. If you're between sizes, we suggest sizing up for a more comfortable fit.",
            },
            {
                q: "Are your products true to size?",
                a: "Our products are designed to be true to size. However, fit can vary slightly between styles. Check the product description for specific fit notes (slim fit, relaxed fit, oversized, etc.) and refer to customer reviews for additional guidance.",
            },
            {
                q: "What materials do you use?",
                a: "We use premium quality materials including 100% organic cotton, sustainably sourced wool, genuine leather, and high-quality synthetic blends. Material composition is listed on each product page.",
            },
            {
                q: "How should I care for my items?",
                a: "Care instructions are provided on each product's label and product page. Generally, we recommend washing in cold water, avoiding bleach, and air drying when possible to maintain the quality and longevity of your items.",
            },
        ],
    },
    {
        category: "Account & Support",
        faqs: [
            {
                q: "How do I create an account?",
                a: "Click 'Register' at the top of our website and fill in your details. You can also create an account during checkout. Having an account allows you to track orders, save addresses, and access exclusive member offers.",
            },
            {
                q: "I forgot my password. What should I do?",
                a: "Click 'Login' and then 'Forgot Password'. Enter your registered email address and we'll send you a link to reset your password. The link expires after 24 hours for security purposes.",
            },
            {
                q: "How can I update my account information?",
                a: "Log into your account and go to 'Profile'. Here you can update your name, email, password, and saved addresses. Changes take effect immediately.",
            },
            {
                q: "How do I contact customer support?",
                a: "You can reach us via email at support@markrin.com, call us at +91 98755 40545 (Mon-Sat, 10 AM - 7 PM IST), or use the contact form on our website. We typically respond within 24 hours.",
            },
        ],
    },
];

function FAQ() {
    const [openItems, setOpenItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const toggleItem = (categoryIndex, faqIndex) => {
        const key = `${categoryIndex}-${faqIndex}`;
        setOpenItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const filteredData = faqData
        .map((category) => ({
            ...category,
            faqs: category.faqs.filter(
                (faq) =>
                    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter(
            (category) =>
                category.faqs.length > 0 &&
                (activeCategory === "all" || category.category === activeCategory)
        );

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Hero Section */}
            <section className="bg-brand-dark-brown py-20 text-center">
                <div className="container mx-auto px-6">
                    <span className="inline-block px-4 py-2 bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-4">
                        Help Center
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto mb-8">
                        Find quick answers to common questions about orders, shipping, returns, and more.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-brand-dark-brown"
                        />
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="sticky top-0 bg-white shadow-sm z-10">
                <div className="container mx-auto px-6">
                    <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === "all"
                                ? "bg-brand-dark-brown text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            All Categories
                        </button>
                        {faqData.map((category) => (
                            <button
                                key={category.category}
                                onClick={() => setActiveCategory(category.category)}
                                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === category.category
                                    ? "bg-brand-dark-brown text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {category.category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 px-4 lg:px-8">
                <div className="container mx-auto max-w-4xl">
                    {filteredData.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                No results found for "{searchQuery}"
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveCategory("all");
                                }}
                                className="mt-4 text-brand-gold hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {filteredData.map((category, categoryIndex) => (
                                <div key={category.category}>
                                    <h2 className="text-2xl font-bold text-brand-dark-brown mb-6 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-brand-gold rounded-full"></span>
                                        {category.category}
                                    </h2>

                                    <div className="space-y-3">
                                        {category.faqs.map((faq, faqIndex) => {
                                            const isOpen = openItems[`${categoryIndex}-${faqIndex}`];
                                            return (
                                                <div
                                                    key={faqIndex}
                                                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(categoryIndex, faqIndex)}
                                                        className="w-full flex items-center justify-between p-5 text-left"
                                                    >
                                                        <span className="font-semibold text-brand-dark-brown pr-4">
                                                            {faq.q}
                                                        </span>
                                                        <HiOutlineChevronDown
                                                            className={`w-5 h-5 text-brand-gold flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                                }`}
                                                        />
                                                    </button>
                                                    <div
                                                        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                            }`}
                                                    >
                                                        <p className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                            {faq.a}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Still Need Help Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-brand-dark-brown mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 rounded-lg"
                        >
                            Contact Support
                        </a>
                        <a
                            href="mailto:support@markrin.com"
                            className="px-8 py-4 border-2 border-brand-dark-brown text-brand-dark-brown font-bold uppercase tracking-wider text-sm hover:bg-brand-dark-brown hover:text-white transition-all duration-300 rounded-lg"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FAQ;
