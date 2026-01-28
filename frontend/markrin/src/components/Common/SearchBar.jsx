import React, { useState } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) setSearchTerm(""); // Clear search when closing
  };

  return (
    <div 
      className={`flex items-center justify-center transition-all duration-300 ${
        isOpen 
          ? "absolute top-0 left-0 w-full bg-brand-white h-24 z-50 px-4" 
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form 
          className="relative flex items-center justify-center w-full max-w-3xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            autoFocus
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark-brown placeholder:text-gray-500 text-brand-text"
          />
          <button
            type="button" // Change to button to prevent form submission
            onClick={handleSearchToggle}
            className="absolute transition-transform right-4 hover:scale-110 "
            aria-label="Close search"
          >
            <HiXMark className="w-6 h-6 text-gray-700 cursor-pointer" />
          </button>
        </form>
      ) : (
        <button 
          onClick={handleSearchToggle} 
          className="p-2 transition-colors rounded-full hover:bg-gray-100"
          aria-label="Open search"
        >
          <HiMagnifyingGlass className="w-6 h-6 text-gray-700 cursor-pointer" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
