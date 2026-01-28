import React from "react";
import { TbBrandFacebook, TbBrandInstagram } from "react-icons/tb";
import { RiTwitterXLine } from "react-icons/ri";

function Topbar() {
  return (
    <div className="p-2 bg-brand-dark-brown text-brand-cream font-inter">
      <div className="container flex items-center justify-between mx-auto">

        {/* Social Icons */}
        <div className="flex items-center space-x-3">
          <a
            href="https://www.facebook.com/profile.php?id=61581277903401"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-gold"
          >
            <TbBrandFacebook className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com/markrin1015/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-gold"
          >
            <TbBrandInstagram className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="transition-colors hover:text-brand-gold"
          >
            <RiTwitterXLine className="w-4 h-4" />
          </a>
        </div>

        {/* Tagline */}
        <div className="hidden sm:block text-xs font-medium tracking-[0.2em] uppercase">
          <span className="text-brand-gold">✦</span> Feel the Soul of Art <span className="text-brand-gold">✦</span> Free Shipping Over $100
        </div>

        {/* Contact Link */}
        <div className="text-xs">
          <a href="tel:+919875540545" className="transition-colors hover:text-brand-gold">
            +91 98755 40545
          </a>
        </div>

      </div>
    </div>
  );
}

export default Topbar;
