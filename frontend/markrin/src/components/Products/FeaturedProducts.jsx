import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi2";
import { productsAPI } from "../../api";
import { useCart } from "../../context/CartContext";

function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productsAPI.getFeatured();
                setProducts(data.slice(0, 8)); // Show max 8 products
            } catch (err) {
                console.error("Error fetching products:", err);
                // Fallback to mock data
                setProducts([
                    {
                        _id: null,
                        name: "Classic White T-Shirt",
                        price: 29.99,
                        images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" }],
                    },
                    {
                        _id: null,
                        name: "Black Graphic Tee",
                        price: 34.99,
                        images: [{ url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500" }],
                    },
                    {
                        _id: null,
                        name: "Oversized Streetwear",
                        price: 49.99,
                        images: [{ url: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500" }],
                    },
                    {
                        _id: null,
                        name: "Premium Cotton Tee",
                        price: 39.99,
                        images: [{ url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500" }],
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-20 px-4 lg:px-8">
                <div className="container mx-auto">
                    <div className="animate-pulse grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-200 h-80 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 lg:px-8">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="inline-block px-4 py-1 bg-brand-dark-brown/10 text-brand-dark-brown text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                            Bestsellers
                        </span>
                        <h2 className="text-4xl font-bold text-brand-dark-brown">
                            Featured Products
                        </h2>
                    </div>
                    <Link
                        to="/shop"
                        className="hidden md:inline-block px-6 py-3 border-2 border-brand-dark-brown text-brand-dark-brown font-bold uppercase tracking-wider text-sm hover:bg-brand-dark-brown hover:text-white transition-all duration-300"
                    >
                        View All
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div key={product._id || `${product.name}-${index}`} className="group">
                            <div className="relative overflow-hidden rounded-2xl bg-gray-100 mb-4">
                                {product._id ? (
                                    <Link to={`/product/${product.slug || product._id}`}>
                                        <img
                                            src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
                                            alt={product.name}
                                            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </Link>
                                ) : (
                                    <img
                                        src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
                                        alt={product.name}
                                        className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}

                                {/* Hover Actions */}
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => product._id && addItem({ productId: product._id, quantity: 1 })}
                                            className="flex-grow py-3 bg-white text-brand-dark-brown font-bold text-xs uppercase tracking-wider hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <HiOutlineShoppingBag className="w-4 h-4" />
                                            Add to Cart
                                        </button>
                                        <button className="p-3 bg-white text-brand-dark-brown hover:bg-red-50 hover:text-red-500 transition-colors">
                                            <HiOutlineHeart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Badge */}
                                {product.isFeatured && (
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-brand-gold text-brand-dark-brown text-xs font-bold uppercase rounded-full">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            {product._id ? (
                                <Link to={`/product/${product.slug || product._id}`}>
                                    <h3 className="font-semibold text-brand-dark-brown mb-1 group-hover:text-brand-gold transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-lg font-bold text-brand-gold">
                                        ₹{product.price?.toFixed(2)}
                                    </p>
                                </Link>
                            ) : (
                                <>
                                    <h3 className="font-semibold text-brand-dark-brown mb-1 group-hover:text-brand-gold transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-lg font-bold text-brand-gold">
                                        ${product.price?.toFixed(2)}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        to="/shop"
                        className="inline-block px-6 py-3 border-2 border-brand-dark-brown text-brand-dark-brown font-bold uppercase tracking-wider text-sm hover:bg-brand-dark-brown hover:text-white transition-all duration-300"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default FeaturedProducts;
