import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";

import {
    HiChevronDown,
    HiChevronUp,
    HiChevronLeft,
    HiChevronRight,
    HiOutlineShare,
} from "react-icons/hi2";
import { getProductDetailUrl, getThumbnailUrl } from "../../utils/cloudinaryHelper";
import { toast } from "sonner";

const PDPGallery = ({ product }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // If no images at all, return null
    if (!product?.images?.length) return null;

    // TODO: remove this fallback when real multi-image data is available
    // Duplicate the image if only 1 exists, just to show the gallery UI for testing
    const images = product.images.length === 1
        ? [product.images[0], product.images[0], product.images[0], product.images[0]]
        : product.images;

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (err) { }
    };

    const activeBasePrice = product?.basePrice || product?.price || 0;
    const discountPercentage =
        product.discountPrice && product.discountPrice < activeBasePrice
            ? Math.round(((activeBasePrice - product.discountPrice) / activeBasePrice) * 100)
            : 0;

    return (
        <div className={`product-gallery ${images.length > 1 ? "grid grid-cols-1 md:grid-cols-[82px_1fr]" : "flex"} gap-3 h-fit`}>

            {/* 1. Vertical Thumbnail Strip (Desktop) */}
            {images.length > 1 && (
                <div className="thumbnail-list hidden md:flex flex-col relative h-full max-h-[600px]" style={{ minWidth: "82px" }}>

                    {/* Custom Nav Prev (Up) */}
                    <div className="thumb-prev-custom w-full flex justify-center py-1 cursor-pointer hover:bg-gray-50 text-gray-400">
                        <HiChevronUp className="w-4 h-4" />
                    </div>

                    <Swiper
                        onSwiper={setThumbsSwiper}
                        direction="vertical"
                        spaceBetween={10}
                        slidesPerView={5} // Show ~5 thumbnails at a time
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        navigation={{
                            prevEl: ".thumb-prev-custom",
                            nextEl: ".thumb-next-custom",
                        }}
                        className="w-full h-full !pb-2"
                        style={{ maxHeight: "500px" }}
                    >
                        {images.map((img, idx) => (
                            <SwiperSlide key={idx} className="!h-auto !w-full flex-shrink-0">
                                <div
                                    className={`w-[72px] h-[94px] rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${activeIndex === idx
                                        ? "border-brand-dark-brown shadow-md opacity-100"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={getThumbnailUrl(img.url)}
                                        alt={`Thumb ${idx}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Nav Next (Down) */}
                    <div className="thumb-next-custom w-full flex justify-center py-1 cursor-pointer hover:bg-gray-50 text-gray-400">
                        <HiChevronDown className="w-4 h-4" />
                    </div>
                </div>
            )}

            {/* 2. Main Image Slider */}
            <div className="main-preview flex-1 relative h-full w-full overflow-hidden rounded-xl bg-gray-50 group">
                <Swiper
                    spaceBetween={0}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs, Zoom]}
                    zoom={true}
                    navigation={{
                        prevEl: ".main-prev-custom",
                        nextEl: ".main-next-custom",
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className="w-full h-full aspect-[4/5]"
                >
                    {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="swiper-zoom-container w-full h-full">
                                <img
                                    src={getProductDetailUrl(img.url)}
                                    alt={img.altText || product.name}
                                    className="w-full h-full object-cover"
                                    loading={idx === 0 ? "eager" : "lazy"}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Arrows (Overlay) */}
                <button className="main-prev-custom absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-md cursor-pointer disabled:opacity-0">
                    <HiChevronLeft className="w-5 h-5" />
                </button>
                <button className="main-next-custom absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-md cursor-pointer disabled:opacity-0">
                    <HiChevronRight className="w-5 h-5" />
                </button>

                {/* Badges - Top Left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.isNewArrival && (
                        <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                            New
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm border border-amber-200/50">
                            ✦ Design of the Week
                        </span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                            −{discountPercentage}% OFF
                        </span>
                    )}
                </div>

                {/* Share Button - Top Right */}
                <button
                    onClick={handleShare}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-500 opacity-0 group-hover:opacity-100 transition-all hover:text-brand-dark-brown shadow-sm"
                >
                    <HiOutlineShare className="w-4 h-4" />
                </button>
            </div>

        </div>
    );
};

export default PDPGallery;
