import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { RiHeartLine, RiTruckLine, RiShieldCheckLine } from "react-icons/ri";


const selectedProduct = {
  name: "Classic White T-Shirt",
  price: "$29.99",
  originalPrice: "$39.99",
  description:
    "A timeless essential crafted from 100% organic Peruvian cotton. Features a reinforced crewneck and a tailored fit that maintains its shape wash after wash.",
  brand: "EcoWear",
  material: "100% Organic Cotton",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["White", "Black", "Navy", "Sand"],
  images: [
    {
      url: "https://images.unsplash.com",
      altText: "White T-shirt Front",
    },
    {
      url: "https://images.unsplash.com",
      altText: "White T-shirt Details",
    },
  ],
};

function ProductDetails() {
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, []);

  const handleQuantityChange = (type) => {
    if (type === "plus") setQuantity((p) => p + 1);
    else if (type === "minus" && quantity > 1) setQuantity((p) => p - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !currentColor) {
      toast.error("Please select a size and color", {
        className: "bg-brand-maroon-accent text-white border-none",
      });
      return;
    }

    setIsAdding(true);
    // Simulating API Call
    setTimeout(() => {
      toast.success(`${selectedProduct.name} added to bag!`, {
        className: "bg-brand-dark-brown text-brand-cream border-none",
      });
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className="min-h-screen py-12 bg-brand-cream font-inter lg:py-20">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* 1. Image Gallery Section */}
          <div className="flex flex-col-reverse gap-4 lg:flex-row lg:w-3/5">
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto lg:flex-col lg:overflow-visible scrollbar-hide">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img.url)}
                  className={`relative flex-shrink-0 w-20 h-24 overflow-hidden rounded-md border-2 transition-all ${
                    mainImage === img.url
                      ? "border-brand-gold"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Main Display */}
            <div className="relative flex-1 overflow-hidden bg-white rounded-xl shadow-sm group">
              <img
                src={mainImage}
                alt="Product focus"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button className="absolute p-3 transition-colors bg-white rounded-full shadow-md top-4 right-4 hover:text-brand-maroon-accent">
                <RiHeartLine size={20} />
              </button>
            </div>
          </div>

          {/* 2. Product Information Section */}
          <div className="lg:w-2/5 lg:sticky lg:top-32">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-widest uppercase text-brand-gold">
                <span>{selectedProduct.brand}</span>
                <span className="w-1 h-1 rounded-full bg-brand-gold/40"></span>
                <span className="text-gray-400">Sustainable Choice</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-brand-dark-brown lg:text-5xl">
                {selectedProduct.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-brand-text">
                  {selectedProduct.price}
                </span>
                <span className="text-xl text-gray-400 line-through decoration-brand-maroon-accent/30">
                  {selectedProduct.originalPrice}
                </span>
              </div>
            </header>

            {/* Color Picker */}
            <div className="mb-8">
              <label className="block mb-4 text-sm font-bold tracking-wide uppercase text-brand-dark-brown">
                Color:{" "}
                <span className="ml-1 font-medium capitalize text-gray-500">
                  {currentColor || "Choose"}
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`group relative w-10 h-10 rounded-full border p-0.5 transition-all ${
                      currentColor === color
                        ? "border-brand-gold ring-2 ring-brand-gold/20 scale-110"
                        : "border-gray-200"
                    }`}
                  >
                    <span
                      className="block w-full h-full rounded-full shadow-inner"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    <span className="absolute px-2 py-1 text-[10px] text-white transition-opacity translate-x-1/2 bg-brand-dark-brown rounded -top-8 right-1/2 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Picker */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold tracking-wide uppercase text-brand-dark-brown">
                  Size
                </label>
                <button className="text-xs font-bold underline transition-colors uppercase text-brand-gold hover:text-brand-dark-brown">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-bold transition-all border rounded-lg ${
                      selectedSize === size
                        ? "bg-brand-dark-brown text-brand-white border-brand-dark-brown shadow-md"
                        : "bg-white text-brand-text border-gray-100 hover:border-brand-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-brand-white">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="flex items-center justify-center w-12 h-full text-xl transition-colors hover:text-brand-gold"
                  >
                    −
                  </button>
                  <span className="w-10 text-lg font-bold text-center text-brand-dark-brown">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="flex items-center justify-center w-12 h-full text-xl transition-colors hover:text-brand-gold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`relative flex-1 py-4 overflow-hidden rounded-xl font-bold uppercase tracking-[0.2em] transition-all ${
                    isAdding
                      ? "bg-gray-100 text-gray-400 cursor-wait"
                      : "bg-brand-gold text-brand-dark-brown hover:bg-brand-dark-brown hover:text-brand-white hover:shadow-xl hover:shadow-brand-gold/20"
                  }`}
                >
                  <span className={isAdding ? "opacity-0" : "opacity-100"}>
                    Add to Bag
                  </span>
                  {isAdding && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-brand-dark-brown border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* USP Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200/60">
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                  <RiTruckLine size={20} className="text-brand-gold" />
                  <span>Free Express Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                  <RiShieldCheckLine size={20} className="text-brand-gold" />
                  <span>2-Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Description Accordion (Simplified for 2026 Style) */}
            <div className="mt-12 space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-bold tracking-wide uppercase text-brand-dark-brown">
                  The Detail
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {selectedProduct.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 p-5 border rounded-xl bg-brand-white border-gray-100/50">
                <div>
                  <span className="block mb-1 text-[10px] font-bold text-gray-400 uppercase">
                    Material
                  </span>
                  <span className="text-sm font-medium text-brand-dark-brown">
                    {selectedProduct.material}
                  </span>
                </div>
                <div>
                  <span className="block mb-1 text-[10px] font-bold text-gray-400 uppercase">
                    Care
                  </span>
                  <span className="text-sm font-medium text-brand-dark-brown">
                    Machine Wash Cold
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

