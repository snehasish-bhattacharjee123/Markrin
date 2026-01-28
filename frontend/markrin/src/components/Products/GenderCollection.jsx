import React from "react";
import { Link } from "react-router-dom";
import MenCollectionImg from "../../assets/portrait-young-couple-yellow.jpg";
import WomenCollectionImg from "../../assets/shirt-mockup-concept-with-plain-clothing.jpg";

const collections = [
  {
    title: "Women's Collection",
    image: WomenCollectionImg,
    path: "/collections/women",
    alt: "Browse our latest women's fashion styles",
  },
  {
    title: "Men's Collection",
    image: MenCollectionImg,
    path: "/collections/men",
    alt: "Explore our premium men's apparel",
  },
];

function GenderCollection() {
  return (
    <section className="py-16 px-4 lg:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((item, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg"
          >
            {/* Image with hover zoom effect */}
            <img
              src={item.image}
              alt={item.alt}
              className="w-full h-[600px] lg:h-[750px] object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Content Box */}
            <div className="absolute bottom-8 left-8 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h2>
              <Link
                to={item.path}
                className="inline-block px-8 py-3 bg-brand-gold text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-dark-brown transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GenderCollection;
