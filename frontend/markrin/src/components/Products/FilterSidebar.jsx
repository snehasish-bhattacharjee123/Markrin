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
    maxPrice: searchParams.get("maxPrice") || 5000,
  });

  const [priceRange, setPriceRange] = useState([
    Number(filters.minPrice),
    Number(filters.maxPrice) || 5000,
  ]);

  // Categories matching the Product model
  const categories = ['Oversized', 'Sweatshirts', 'Hoodies', 'Normal Tshirt'];

  // Genders matching the Product model
  const genders = ["Unisex"];

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
      maxPrice: params.maxPrice || 5000,
    });
    setPriceRange([
      Number(params.minPrice) || 0,
      Number(params.maxPrice) || 5000,
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

  const handlePriceChange = (type, value) => {
    const newVal = Number(value);
    const newRange = type === 'min' ? [newVal, priceRange[1]] : [priceRange[0], newVal];

    // Validation: min shouldn't exceed max, max shouldn't be below min
    if (type === 'min' && newVal > priceRange[1]) return;
    if (type === 'max' && newVal < priceRange[0]) return;

    setPriceRange(newRange);
    handleFilterChange(type === 'min' ? "minPrice" : "maxPrice", newVal);
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
      maxPrice: 5000,
    });
    setPriceRange([0, 5000]);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.gender ||
    filters.color.length > 0 ||
    filters.size.length > 0 ||
    filters.material.length > 0 ||
    filters.brand.length > 0 ||
    Number(filters.maxPrice) < 5000;

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

      {/* Price Range Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Price Range
        </h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Min</label>
              <input
                type="number"
                min="0"
                max="5000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Max</label>
              <input
                type="number"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="w-full h-1.5 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-gold"
          />
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
                : "bg-white text-gray-500 border-gray-100 hover:text-brand-gold"
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
