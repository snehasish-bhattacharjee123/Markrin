import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiMagnifyingGlass, HiXMark, HiArrowRight } from "react-icons/hi2";
import { productsAPI } from "../../api";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Debouncing effect for search suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setLoading(true);
        try {
          const data = await productsAPI.getAll({ search: searchTerm, limit: 5 });
          setSuggestions(data.products || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Suggestion error:", err);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  return (
    <div
      ref={searchRef}
      className={`flex items-center justify-center transition-all duration-300 ${isOpen
        ? "absolute top-0 left-0 w-full bg-brand-white h-24 z-50 px-4"
        : "w-auto"
        }`}
    >
      {isOpen ? (
        <div className="relative w-full max-w-3xl">
          <form
            className="relative flex items-center justify-center w-full"
            onSubmit={handleSearch}
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
              type="button"
              onClick={handleSearchToggle}
              className="absolute transition-transform right-4 hover:scale-110 "
              aria-label="Close search"
            >
              <HiXMark className="w-6 h-6 text-gray-700 cursor-pointer" />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && searchTerm.trim() !== "" && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-gold mx-auto"></div>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Top Results
                  </div>
                  {suggestions.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product.slug || product._id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchTerm("");
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      <img
                        src={product.images?.[0]?.url || "https://via.placeholder.com/50"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-bold text-brand-dark-brown truncate group-hover:text-brand-gold transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-sm font-bold text-brand-gold">
                        ${product.price?.toFixed(2)}
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-brand-gold hover:text-brand-dark-brown flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    See all results <HiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No products found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
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
