// import React, { useEffect, useEffectEvent } from "react";

// const FilterSidebar = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [filters, setFilters] = React.useState({
//     category: searchParams.getAll("category") || [],
//     gender: searchParams.get("gender") || "",
//     color: searchParams.getAll("color") || [],
//     size: searchParams.getAll("size") || [],
//     material: searchParams.getAll("material") || [],
//     priceRange: searchParams.get("priceRange") || "",
//     brand: searchParams.getAll("brand") || [],
//     minPrice: searchParams.get("minPrice") || "",
//     maxPrice: searchParams.get("maxPrice") || "",
//   });

//   const [priceRange, setPriceRange] = useState([0, 100]);

//   const categories = ["T-Shirts", "Jeans", "Jackets", "Shoes", "Accessories"];
//   const genders = ["Men", "women", "Unisex"];
//   const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"];
//   const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
//   const materials = ["Cotton", "Polyester", "Wool", "Leather"];
//   const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];

//   useEffect(() => {
//     const params = Object.fromEntries([...searchParams]);
//     // Update params based on filters state

//     setFilters({
//       category: params.category ? params.category.split(",") : [],
//       gender: params.gender || "",
//       color: params.color ? params.color.split(",") : [],
//       size: params.size ? params.size.split(",") : [],
//       material: params.material ? params.material.split(",") : [],
//       priceRange: params.priceRange || "",
//       brand: params.brand ? params.brand.split(",") : [],
//       minPrice: params.minPrice || "",
//       maxPrice: params.maxPrice || "",
//     });
//     setPriceRange([
//       params.minPrice ? Number(params.minPrice) : 0,
//       params.maxPrice ? Number(params.maxPrice) : 100,
//     ]);
//   }, [searchParams]);

//   return <div className="p-4">
//     <h3 className="text-xl font-medium mb-4">Filters</h3>

//     {/* Category Filter */}
//     <div className="mb-4">
//       <h4 className="font-medium mb-2">Category</h4>
//       {categories.map((category) => (
//         <label key={category} className="block">
//           <input
//             type="checkbox"
//             checked={filters.category.includes(category)}
//             onChange={() => {
//               const newCategories = filters.category.includes(category)
//                 ? filters.category.filter((c) => c !== category)
//                 : [...filters.category, category];
//               setFilters({ ...filters, category: newCategories });
//             }}
//           />
//           {category}
//         </label>
//       ))}
//     </div>

//     {/* Gender Filter */}
//     <div className="mb-4">
//       <h4 className="font-medium mb-2">Gender</h4>
//       {genders.map((gender) => (
//         <label key={gender} className="block">
//           <input
//             type="radio"
//             name="gender"
//             checked={filters.gender === gender}
//             onChange={() => setFilters({ ...filters, gender })}
//           />
//           {gender}
//         </label>
//       ))}
//     </div>

//     {/* Color Filter */}
//     <div className="mb-4">
//       <h4 className="font-medium mb-2">Color</h4>
//       {colors.map((color) => (
//         <label key={color} className="block">
//           <input
//             type="checkbox"
//             checked={filters.color.includes(color)}
//             onChange={() => {
//               const newColors = filters.color.includes(color)
//                 ? filters.color.filter((c) => c !== color)
//                 : [...filters.color, color];
//               setFilters({ ...filters, color: newColors });
//             }}
//           />
//           {color}
//         </label>
//       ))}
//     </div>

//     {/* Size Filter */}
//     <div className="mb-4">
//       <h4 className="font-medium mb-2">Size</h4>
//       {sizes.map((size) => (
//         <label key={size} className="block">
//           <input
//             type="checkbox"
//             checked={filters.size.includes(size)}
//             onChange={() => {
//               const newSizes = filters.size.includes(size)
//                 ? filters.size.filter((s) => s !== size)
//                 : [...filters.size, size];
//               setFilters({ ...filters, size: newSizes });
//             }}
//           />
//           {size}
//         </label>
//       ))}
//     </div>

//     {/* Material Filter */}
//     <div className="mb-4">
//       <h4 className="font-medium mb-2">Material</h4>
//       {materials.map((material) => (
//         <label key={material} className="block">
//           <input
//             type="checkbox"
//             checked={filters.material.includes(material)}
//             onChange={() => {
//               const newMaterials = filters.material.includes(material)
//                 ? filters.material.filter((m) => m !== material)
//                 : [...filters.material, material];
//               setFilters({ ...filters, material: newMaterials });
//             }}
//           />
//           {material}
//         </label>
//       ))}
//     </div>

//     {/* Price Range Filter */}
//     <div className="mb-4">
//       <h4 className="font-medium mb-2">Price Range</h4>
//       $0 - $100
//     </div>

//     {/* Brand Filter */}
//     <div className="mb-4">
//       <h4 className="font-medium mb-2">Brand</h4>
//       {brands.map((brand) => (
//         <label key={brand} className="block">
//           <input
//             type="checkbox"
//             checked={filters.brand.includes(brand)}
//             onChange={() => {
//               const newBrands = filters.brand.includes(brand)
//                 ? filters.brand.filter((b) => b !== brand)
//                 : [...filters.brand, brand];
//               setFilters({ ...filters, brand: newBrands });
//             }}
//           />
//           {brand}
//         </label>
//       ))}
//     </div>

//   </div>;
// };

// export default FilterSidebar;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get("category")?.split(",") || [],
    gender: searchParams.get("gender") || "",
    color: searchParams.get("color") || [], // Assume CSV in URL
    size: searchParams.get("size")?.split(",") || [],
    material: searchParams.get("material")?.split(",") || [],
    brand: searchParams.get("brand")?.split(",") || [],
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 100,
  });

  const [priceRange, setPriceRange] = useState([
    Number(filters.minPrice),
    Number(filters.maxPrice),
  ]);

  const categories = ["T-Shirts", "Jeans", "Jackets", "Shoes", "Accessories"];
  const genders = ["Men", "Women", "Unisex"];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Polyester", "Wool", "Leather"];
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];

  // 1. Sync local state when URL changes (e.g., back button)
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
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([
      Number(params.minPrice) || 0,
      Number(params.maxPrice) || 100,
    ]);
  }, [searchParams]);

  // 2. Update URL when filters state changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      const val = newFilters[k];
      if (Array.isArray(val) && val.length > 0) {
        params.set(k, val.join(",")); // CSV format for multiple values
      } else if (val && !Array.isArray(val)) {
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
    const newMax = e.target.value;
    setPriceRange([0, newMax]);
    handleFilterChange("maxPrice", newMax);
    handleFilterChange("minPrice", 0);
  };

  return (
    <div className="p-6 bg-brand-white border-r border-gray-100 h-full overflow-y-auto font-inter">
      <h3 className="text-xl font-bold text-brand-dark-brown mb-6 uppercase tracking-tighter">
        Filters
      </h3>

      {/* Category Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Category
        </h4>
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center space-x-3 mb-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold/20"
              checked={filters.category.includes(category)}
              onChange={() => handleCheckboxChange("category", category)}
            />
            <span className="text-sm text-gray-600 group-hover:text-brand-dark-brown transition-colors">
              {category}
            </span>
          </label>
        ))}
      </div>

      {/* Gender Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Gender
        </h4>
        {genders.map((gender) => (
          <label
            key={gender}
            className="flex items-center space-x-3 mb-2 cursor-pointer group"
          >
            <input
              type="radio"
              name="gender"
              className="w-4 h-4 border-gray-300 text-brand-gold focus:ring-brand-gold/20"
              checked={filters.gender === gender}
              onChange={() => handleFilterChange("gender", gender)}
            />
            <span className="text-sm text-gray-600 group-hover:text-brand-dark-brown transition-colors">
              {gender}
            </span>
          </label>
        ))}
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
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-gold"
        />
        <div className="flex justify-between mt-2 text-xs font-bold text-brand-dark-brown">
          <span>$0</span>
          <span>${priceRange[1]}</span>
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
              key={color}
              onClick={() => handleCheckboxChange("color", color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                filters.color.includes(color)
                  ? "border-brand-dark-brown scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
        </div>
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
              className={`py-2 text-[10px] font-bold border rounded transition-all ${
                filters.size.includes(size)
                  ? "bg-brand-dark-brown text-white border-brand-dark-brown"
                  : "bg-white text-gray-500 border-gray-100 hover:border-brand-gold"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
          Brand
        </h4>
        {brands.map((brand) => (
          <label
            key={brand}
            className="flex items-center space-x-3 mb-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-brand-gold"
              checked={filters.brand.includes(brand)}
              onChange={() => handleCheckboxChange("brand", brand)}
            />
            <span className="text-sm text-gray-600 group-hover:text-brand-dark-brown transition-colors">
              {brand}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
