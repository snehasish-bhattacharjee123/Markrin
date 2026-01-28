import React from 'react';
import { Link } from 'react-router-dom';
import {
  RiFacebookFill,
  RiInstagramLine,
  RiTwitterXLine,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine
} from "react-icons/ri";

function Footer() {
  return (
    <footer className="py-16 border-t bg-brand-dark-brown text-brand-cream font-inter">
      <div className="container grid grid-cols-1 gap-12 px-6 mx-auto md:grid-cols-4 lg:px-0">

        {/* 1. Brand Info */}
        <div className="flex flex-col">
          <Link to="/" className="text-2xl font-bold tracking-tighter uppercase text-white mb-4">
            Markrin<span className="text-brand-gold">.</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-300 mb-4">
            <em>"Feel the Soul of Art"</em>
          </p>
          <p className="text-sm leading-relaxed text-gray-400 mb-6">
            Premium streetwear for the modern, confident individual. Express yourself through art you can wear.
          </p>

          {/* Contact Info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <RiMapPinLine className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>64/3 Nabin Senapati Lane, Howrah - 711101</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <RiPhoneLine className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <a href="tel:+919875540545" className="hover:text-brand-gold transition-colors">
                +91 98755 40545
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <RiMailLine className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <a href="mailto:support@markrin.com" className="hover:text-brand-gold transition-colors">
                support@markrin.com
              </a>
            </div>
          </div>
        </div>

        {/* 2. Shop Links */}
        <div>
          <h3 className="mb-6 text-lg font-bold tracking-wider uppercase text-brand-white">Shop</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shop" className="transition-colors hover:text-brand-gold">All Products</Link></li>
            <li><Link to="/collection/new-arrivals" className="transition-colors hover:text-brand-gold">New Arrivals</Link></li>
            <li><Link to="/collection/graphic-tees" className="transition-colors hover:text-brand-gold">Graphic Tees</Link></li>
            <li><Link to="/collection/men" className="transition-colors hover:text-brand-gold">Men's Collection</Link></li>
            <li><Link to="/collection/women" className="transition-colors hover:text-brand-gold">Women's Collection</Link></li>
          </ul>
        </div>

        {/* 3. Support Links */}
        <div>
          <h3 className="mb-6 text-lg font-bold tracking-wider uppercase text-brand-white">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/contact" className="transition-colors hover:text-brand-gold">Contact Us</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-brand-gold">About Us</Link></li>
            <li><Link to="/contact#faq" className="transition-colors hover:text-brand-gold">FAQs</Link></li>
            <li><Link to="/shipping" className="transition-colors hover:text-brand-gold">Shipping Policy</Link></li>
            <li><Link to="/returns" className="transition-colors hover:text-brand-gold">Returns & Refunds</Link></li>
            <li><Link to="/privacy" className="transition-colors hover:text-brand-gold">Privacy Policy</Link></li>
            <li><Link to="/terms" className="transition-colors hover:text-brand-gold">Terms of Service</Link></li>
          </ul>
        </div>

        {/* 4. Follow Us & Social Icons */}
        <div>
          <h3 className="mb-6 text-lg font-bold tracking-wider uppercase text-brand-white">Follow Us</h3>
          <p className="mb-6 text-sm text-gray-300">Join our community and share your style!</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=61581277903401"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-brand-gold hover:text-brand-dark-brown"
            >
              <RiFacebookFill className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/markrin1015/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-brand-gold hover:text-brand-dark-brown"
            >
              <RiInstagramLine className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-brand-gold hover:text-brand-dark-brown"
            >
              <RiTwitterXLine className="w-5 h-5" />
            </a>
          </div>

          {/* Newsletter */}
          <div className="mt-8">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Newsletter</h4>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow p-3 text-sm bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                required
              />
              <button
                type="submit"
                className="px-4 py-3 text-xs font-bold uppercase bg-brand-gold text-brand-dark-brown rounded-md hover:bg-white transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="container px-6 pt-12 mx-auto mt-12 text-center border-t border-gray-700 lg:px-0">
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          © 2026 Markrin. All rights reserved. | Feel the Soul of Art.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
