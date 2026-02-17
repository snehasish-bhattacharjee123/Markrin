import React from "react";
import { Link } from "react-router-dom";
import {
  RiFacebookFill,
  RiInstagramLine,
  RiTwitterXLine,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
} from "react-icons/ri";

function Footer() {
  return (
    <footer className="bg-brand-dark-brown text-white font-inter relative overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 py-16">
          {/* 1. Brand Info */}
          <div className="flex flex-col lg:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight uppercase text-white mb-4 inline-block"
            >
              Markrin<span className="text-brand-gold">.</span>
            </Link>
            <p className="text-sm leading-relaxed text-brand-gold/80 italic mb-3">
              "Feel the Soul of Art"
            </p>
            <p className="text-sm leading-relaxed text-white mb-6 max-w-xs">
              Premium streetwear for the modern, confident individual. Express
              yourself through art you can wear.
            </p>

            {/* Contact Info */}
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3 text-white group">
                <RiMapPinLine className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-snug">
                  64/3 Nabin Senapati Lane,
                  <br />
                  Howrah - 711101
                </span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <RiPhoneLine className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a
                  href="tel:+919875540545"
                  className="hover:text-brand-gold transition-colors duration-200"
                >
                  +91 98755 40545
                </a>
              </div>
              <div className="flex items-center gap-3 text-white">
                <RiMailLine className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a
                  href="mailto:support@markrin.com"
                  className="hover:text-brand-gold transition-colors duration-200"
                >
                  support@markrin.com
                </a>
              </div>
            </div>
          </div>

          {/* 2. Shop Links */}
          <div>
            <h3 className="mb-6 text-xs font-bold tracking-[0.2em] uppercase text-brand-gold">
              Shop
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "All Products", path: "/shop" },
                { label: "New Arrivals", path: "/collection/new-arrivals" },
                { label: "Graphic Tees", path: "/collection/graphic-tees" },
                { label: "Men's Collection", path: "/collection/men" },
                { label: "Women's Collection", path: "/collection/women" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-white hover:text-brand-gold hover:pl-1 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Support Links */}
          <div>
            <h3 className="mb-6 text-xs font-bold tracking-[0.2em] uppercase text-brand-gold">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Contact Us", path: "/contact" },
                { label: "About Us", path: "/about" },
                { label: "FAQs", path: "/faq" },
                { label: "Shipping Policy", path: "/shipping" },
                { label: "Returns & Refunds", path: "/returns" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Service", path: "/terms" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-white hover:text-brand-gold hover:pl-1 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Connect */}
          <div>
            <h3 className="mb-6 text-xs font-bold tracking-[0.2em] uppercase text-brand-gold">
              Connect
            </h3>
            <p className="mb-5 text-sm text-white leading-relaxed">
              Follow us for style inspiration, new drops, and exclusive offers.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-8">
              {[
                {
                  Icon: RiFacebookFill,
                  href: "https://www.facebook.com/profile.php?id=61581277903401",
                  label: "Facebook",
                },
                {
                  Icon: RiInstagramLine,
                  href: "https://instagram.com/markrin1015/",
                  label: "Instagram",
                },
                {
                  Icon: RiTwitterXLine,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-brand-gold hover:text-brand-dark-brown hover:border-brand-gold hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Newsletter Mini */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/80">
                Newsletter
              </h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold/50 text-white placeholder:text-gray-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-3 text-xs font-bold uppercase bg-brand-gold text-brand-dark-brown rounded-xl hover:bg-white transition-colors duration-300"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] tracking-widest text-white uppercase">
            © 2026 Markrin. All rights reserved.
          </p>
          <p className="text-[11px] tracking-wider text-white italic">
            Feel the Soul of Art.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
