import React from "react";
import { TbBrandFacebook, TbBrandInstagram } from "react-icons/tb";
import { RiTwitterXLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function Topbar() {
  return (
    <div className="p-2 bg-brand-dark-brown text-brand-cream font-inter">
      <div className="container flex items-center justify-between mx-auto">

        {/* Social Icons */}
        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="https://www.facebook.com/profile.php?id=61581277903401"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-gold"
          >
            <TbBrandFacebook className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/markrin1015/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-gold"
          >
            <TbBrandInstagram className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="transition-colors hover:text-brand-gold"
          >
            <RiTwitterXLine className="w-5 h-5" />
          </a>
        </div>

        {/* Tagline */}
        {/* Marquee Section */}
        <div className="flex-1 overflow-hidden mx-4 relative max-w-xl lg:max-w-2xl">
          <div className="animate-marquee">
            {/* Set 1 */}
            <div className="flex items-center space-x-8 px-4">
              <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap">
                Free Home Delivery for Paid Orders 🚚
              </span>
              <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap">
                <span className="text-brand-gold">✦</span> Feel the Soul of Art <span className="text-brand-gold">✦</span> Free Shipping Over ₹2000
              </span>
              <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap">
                7-Day Money-Back Guarantee 🥇
              </span>
            </div>

            {/* Set 2 (Duplicate for seamless loop) */}
            <div className="flex items-center space-x-8 px-4">
              <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap">
                Free Home Delivery for Paid Orders 🚚
              </span>
              <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap">
                <span className="text-brand-gold">✦</span> Feel the Soul of Art <span className="text-brand-gold">✦</span> Free Shipping Over ₹2000
              </span>
              <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap">
                7-Day Money-Back Guarantee 🥇
              </span>
            </div>
          </div>
        </div>

        {/* Contact Link */}
        <div className="text-xs shrink-0 whitespace-nowrap">
          <Link to="/contact" className="transition-colors hover:text-brand-gold">
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Topbar;
