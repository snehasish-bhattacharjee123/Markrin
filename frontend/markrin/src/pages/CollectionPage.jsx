import React, { useState, useEffect, useRef } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import SortOption from "../components/Products/SortOption";
import ProductGrid from "../components/Products/ProductGrid";
import FilterSidebar from "../components/Products/FilterSidebar";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar when clicking outside (Mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // Simulated Data Fetch
  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
        {
          _id: 1,
          name: "Classic White T-Shirt",
          price: "29.99",
          image: { url: "https://images.unsplash.com" },
        },
        {
          _id: 2,
          name: "Classic Black T-Shirt",
          price: "29.99",
          image: { url: "https://images.unsplash.com" },
        },
        {
          _id: 3,
          name: "Classic Blue T-Shirt",
          price: "29.99",
          image: { url: "https://images.unsplash.com" },
        },
      ];
      setProducts(fetchedProducts);
    }, 500);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-brand-cream min-h-screen">
      {/* Mobile Filter Button */}
      <div className="lg:hidden p-4 flex items-center justify-between bg-brand-white border-b border-gray-200">
        <h2 className="text-lg font-bold text-brand-dark-brown uppercase tracking-tighter">
          Collection
        </h2>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 bg-brand-dark-brown text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Filter Sidebar Overlay (Mobile) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar Content */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-brand-white transform transition-transform duration-300 ease-in-out 
          lg:static lg:translate-x-0 lg:w-1/4 lg:h-auto overflow-y-auto border-r border-gray-100
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 lg:hidden border-b border-gray-50">
          <span className="font-bold text-brand-dark-brown uppercase">
            Filters
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400"
          >
            <FiX size={24} />
          </button>
        </div>
        <FilterSidebar />
      </aside>

      {/* Main Product Section */}
      <main className="flex-grow p-6 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark-brown tracking-tighter uppercase">
              All Collection
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {products.length} Products Found
            </p>
          </div>

          <SortOption />
        </div>

        {/* Products Grid */}
        <div className="bg-brand-white/50 rounded-3xl p-2">
          <ProductGrid products={products} />
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;
