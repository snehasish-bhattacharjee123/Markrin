import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineXMark } from "react-icons/hi2";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get("category")?.split(",") || [],
    gender: searchParams.get("gender") || "",
    color: searchParams.get("color")?.split(",") || [],
    size: searchParams.get("size")?.split(",") || [],
    material: searchParams.get("material")?.split(",") || [],
    brand: searchParams.get("brand")?.split(",") || [],
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 500,
  });

  const [priceRange, setPriceRange] = useState([
    Number(filters.minPrice),
    Number(filters.maxPrice),
  ]);

  // Categories matching the Product model
  const categories = [
    "Topwear",
    "Bottomwear",
  ];

  // Genders matching the Product model
  const genders = ["Men", "Women", "Unisex"];

  // Colors matching the Product model
  const colors = [
    { name: "Black", hex: "#1F2937" },
    // { name: "Red", hex: "#EF4444" },
    // { name: "Blue", hex: "#3B82F6" },
    // { name: "Green", hex: "#22C55E" },
    // { name: "White", hex: "#F9FAFB" },
    // { name: "Yellow", hex: "#EAB308" },
    // { name: "Grey", hex: "#6B7280" },
    // { name: "Brown", hex: "#92400E" },
    // { name: "Pink", hex: "#EC4899" },
    // { name: "Orange", hex: "#F97316" },
  ];

  // Sizes matching the Product model
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Materials matching the Product model
  const materials = ["Cotton", "Polyester", "Wool", "Leather", "Denim", "Silk", "Linen"];

  // Sync local state when URL changes (e.g., back button)
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category ? params.category.split(",") : [],
      gender: params.gender || "",
      color: params.color ? params.color.split(",") : [],
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 500,
    });
    setPriceRange([
      Number(params.minPrice) || 0,
      Number(params.maxPrice) || 500,
    ]);
  }, [searchParams]);

  // Update URL when filters state changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      const val = newFilters[k];
      if (Array.isArray(val) && val.length > 0) {
        params.set(k, val.join(","));
      } else if (val && !Array.isArray(val) && val !== "0" && val !== 0) {
        params.set(k, val);
      }
    });
    setSearchParams(params);
  };

  const handleCheckboxChange = (key, item) => {
    const currentValues = filters[key];
    const newValues = currentValues.includes(item)
      ? currentValues.filter((v) => v !== item)
      : [...currentValues, item];
    handleFilterChange(key, newValues);
  };

  const handlePriceChange = (e) => {
    const newMax = Number(e.target.value);
    setPriceRange([0, newMax]);
    handleFilterChange("maxPrice", newMax);
    handleFilterChange("minPrice", 0);
  };

  const clearAllFilters = () => {
    setFilters({
      category: [],
      gender: "",
      color: [],
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 500,
    });
    setPriceRange([0, 500]);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.gender ||
    filters.color.length > 0 ||
    filters.size.length > 0 ||
    filters.material.length > 0 ||
    filters.brand.length > 0 ||
    Number(filters.maxPrice) < 500;

  return (
    <div className="p-6 bg-brand-white rounded-2xl border border-gray-100 h-fit font-inter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-brand-dark-brown uppercase tracking-tighter">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs font-bold text-brand-maroon-accent hover:text-red-700 transition-colors"
          >
            <HiOutlineXMark className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Category
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold/20 cursor-pointer"
                checked={filters.category.includes(category)}
                onChange={() => handleCheckboxChange("category", category)}
              />
              <span className="text-sm text-gray-600 group-hover:text-brand-dark-brown transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Gender
        </h4>
        <div className="space-y-2">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="gender"
                className="w-4 h-4 border-gray-300 text-brand-gold focus:ring-brand-gold/20 cursor-pointer"
                checked={filters.gender === gender}
                onChange={() => handleFilterChange("gender", gender)}
              />
              <span className="text-sm text-gray-600 group-hover:text-brand-dark-brown transition-colors">
                {gender}
              </span>
            </label>
          ))}
          {filters.gender && (
            <button
              onClick={() => handleFilterChange("gender", "")}
              className="text-xs text-gray-400 hover:text-brand-maroon-accent transition-colors mt-1"
            >
              Clear gender
            </button>
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Price Range
        </h4>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-gold"
        />
        <div className="flex justify-between mt-2 text-xs font-bold text-brand-dark-brown">
          <span>$0</span>
          <span className="px-2 py-1 bg-brand-gold/20 rounded-lg">${priceRange[1]}</span>
        </div>
      </div>

      {/* Color Filter (Visual Circles) */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Color
        </h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleCheckboxChange("color", color.name)}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${filters.color.includes(color.name)
                ? "border-brand-dark-brown ring-2 ring-brand-gold/30 scale-110"
                : "border-gray-200"
                }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
        {filters.color.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.color.map((c) => (
              <span
                key={c}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleCheckboxChange("size", size)}
              className={`py-2 text-[10px] font-bold border rounded-lg transition-all ${filters.size.includes(size)
                ? "bg-brand-dark-brown text-white border-brand-dark-brown"
                : "bg-white text-gray-500 border-gray-100 hover:border-brand-gold hover:text-brand-gold"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Material
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {materials.map((material) => (
            <label
              key={material}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold/20 cursor-pointer"
                checked={filters.material.includes(material)}
                onChange={() => handleCheckboxChange("material", material)}
              />
              <span className="text-sm text-gray-600 group-hover:text-brand-dark-brown transition-colors">
                {material}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
