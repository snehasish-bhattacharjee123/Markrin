import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { HiOutlineHeart, HiHeart, HiStar, HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import { productsAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "sonner";
import { getCardUrl } from "../../utils/cloudinaryHelper";

function JeansEditScroll() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Attempt to fetch 'Jeans' or fallback to general products
                // We'll fetch a larger set and filter content or just show a mix if filtering isn't perfect
                const data = await productsAPI.getAll({ limit: 20 });

                // Simple client-side filter if the API didn't do it, or just use what we have.
                // Assuming 'Jeans' might be in the name or description if not a category filter.
                // For this demo, we'll try to prioritize items with "Jeans" in the name, 
                // otherwise just show what we have so the widget isn't empty.
                let jeansProducts = data.products || [];
                const realJeans = jeansProducts.filter(p => p.name.toLowerCase().includes('jeans'));
                if (realJeans.length > 0) {
                    setProducts(realJeans);
                } else {
                    setProducts(jeansProducts);
                }

            } catch (err) {
                console.error("Failed to fetch jeans products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleToggleWishlist = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await toggleWishlist(productId);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return null; // Or a skeleton if preferred
    if (!products.length) return null;

    return (
        <section
            id="jeans-edit-scroll"
            className="relative w-full py-6 md:py-8 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url("https://images.bewakoof.com/uploads/grid/app/product-scroll-yellow--2--1751446846.png")',
                minHeight: '400px'
            }}
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Title */}
                <div className="mb-6 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-black uppercase tracking-wide">
                        Denim Verse
                    </h2>
                </div>

                {/* Swiper Container */}
                <div className="relative group/swiper">
                    {/* Custom Navigation Buttons */}
                    <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover/swiper:opacity-100 transition-opacity duration-300 disabled:opacity-0 cursor-pointer hover:bg-white">
                        <HiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover/swiper:opacity-100 transition-opacity duration-300 disabled:opacity-0 cursor-pointer hover:bg-white">
                        <HiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    <Swiper
                        modules={[Navigation, FreeMode]}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        freeMode={true}
                        spaceBetween={12}
                        slidesPerView={2.2}
                        breakpoints={{
                            480: { slidesPerView: 2.5, spaceBetween: 15 },
                            640: { slidesPerView: 3.2, spaceBetween: 15 },
                            768: { slidesPerView: 4.2, spaceBetween: 20 },
                            1024: { slidesPerView: 5.2, spaceBetween: 20 },
                        }}
                        className="w-full !pb-4 !px-1"
                    >
                        {products.map((product) => {
                            const discountPercentage =
                                product.discountPrice && product.discountPrice < product.price
                                    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                                    : 0;

                            const displayPrice =
                                product.discountPrice && product.discountPrice < product.price
                                    ? product.discountPrice
                                    : product.price;

                            return (
                                <SwiperSlide key={product._id} className="h-auto">
                                    <div className="bg-white rounded-md overflow-hidden shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100">
                                        <Link to={`/product/${product.slug || product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                                            <img
                                                src={getCardUrl(product.images?.[0]?.url)}
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                                            />

                                            {/* Rating Badge */}
                                            {product.rating > 0 && (
                                                <div className="absolute bottom-2 left-2 flex items-center bg-white/90 backdrop-blur-[2px] px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm z-10">
                                                    {product.rating.toFixed(1)} <HiStar className="w-3 h-3 text-yellow-400 ml-0.5" />
                                                </div>
                                            )}

                                            {/* Fit Badge (Static for "Jeans" context per design, or possibly dynamic if we had tag data) */}
                                            <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-[1px] py-1 px-2">
                                                <span className="text-white text-[10px] uppercase font-semibold tracking-wider">
                                                    {product.tags?.find(t => t.toLowerCase().includes('fit')) || "Slim Straight Fit"}
                                                </span>
                                            </div>

                                            {/* Wishlist Icon */}
                                            <button
                                                onClick={(e) => handleToggleWishlist(e, product._id)}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors z-20"
                                            >
                                                {isInWishlist(product._id) ? (
                                                    <HiHeart className="w-5 h-5 text-red-500" />
                                                ) : (
                                                    <HiOutlineHeart className="w-5 h-5" />
                                                )}
                                            </button>
                                        </Link>

                                        {/* Product Details */}
                                        <div className="p-3 flex flex-col flex-grow bg-white">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">
                                                    {product.brand || "Bewakoof®"}
                                                </h3>
                                            </div>

                                            <Link to={`/product/${product.slug || product._id}`} className="block mb-1.5">
                                                <h2 className="text-xs md:text-sm text-gray-800 font-medium line-clamp-2 leading-tight min-h-[2.5em]" title={product.name}>
                                                    {product.name}
                                                </h2>
                                            </Link>

                                            <div className="mt-auto flex items-baseline gap-2 flex-wrap">
                                                <span className="text-sm md:text-base font-bold text-gray-900">
                                                    ₹{Math.round(displayPrice)}
                                                </span>
                                                {discountPercentage > 0 && (
                                                    <>
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ₹{Math.round(product.price)}
                                                        </span>
                                                        <span className="text-xs font-bold text-green-600">
                                                            {discountPercentage}% OFF
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Member Price or other info could go here */}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default JeansEditScroll;
