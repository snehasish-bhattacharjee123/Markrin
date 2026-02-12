import React, { useState, useRef, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight, HiVolumeUp, HiVolumeOff, HiX, HiShoppingBag } from 'react-icons/hi';

const shoppableVideos = [
  {
    id: 1,
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/a0640b6602b94dada25de7bfb66f74a1.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/a0640b6602b94dada25de7bfb66f74a1.thumbnail.0000000000.jpg?v=1769694969',
    product: {
      name: 'Freefall',
      price: 1199,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/freefall-men-shirt-mydesignation-4264565.jpg?v=1757584339',
      slug: 'freefall-oversized-tee'
    }
  },
  {
    id: 2,
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/a34a6a46ef254435a47870227b26344a.mp4',
    thumbnail: 'https://cdn.shopify.com/s_files/1/0798/9710/0596/files/preview_images/a34a6a46ef254435a47870227b26344a.thumbnail.0000000000.jpg?v=1769163310',
    product: {
      name: 'Shadow Wolf',
      price: 1299,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/shadow-wolf-men-shirt-mydesignation-603557.jpg?v=1764335745',
      slug: 'shadow-wolf-oversized-tee'
    }
  },
  {
    id: 3,
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/0f7da54a33ef4ca8a466a2dd7ca4d504.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/0f7da54a33ef4ca8a466a2dd7ca4d504.thumbnail.0000000000.jpg?v=1769694974',
    product: {
      name: 'Heart Check Shirt',
      price: 1199,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/heart-check-shirt-for-men-men-shirt-mydesignation-6951747.jpg?v=1770852727',
      slug: 'heart-check-shirt'
    }
  },
  {
    id: 4,
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/d52fd8e4c322457e8793b56f870fd1c6.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/d52fd8e4c322457e8793b56f870fd1c6.thumbnail.0000000000.jpg?v=1767876152',
    product: {
      name: 'Guardian Embroidered',
      price: 1699,
      image: 'https://cdn.shopify.com/s_files/1/0798/9710/0596/files/guardian-embroidered-men-shirt-mydesignation-3437254.jpg?v=1765432003',
      slug: 'guardian-embroidered'
    }
  },
  {
    id: 5,
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/25834326e83849039d1840147259b395.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/25834326e83849039d1840147259b395.thumbnail.0000000000.jpg?v=1769694904',
    product: {
      name: 'Red Leaf Embroidered',
      price: 1199,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/royal-embroidered-shirt-men-men-shirt-mydesignation-7184858.jpg?v=1768567976',
      slug: 'red-leaf-embroidered'
    }
  },
  {
    id: 6,
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/4450f28adff34c33929a59155193af03.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/4450f28adff34c33929a59155193af03.thumbnail.0000000000.jpg?v=1767875220',
    product: {
      name: 'Barong Hoodie',
      price: 1999,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/barong-hoodie-hoodie-mydesignation-2583044.jpg?v=1765535249',
      slug: 'barong-hoodie'
    }
  }
];

function ShoppableVideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const scrollRef = useRef(null);
  const videoRefs = useRef([]);

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const cardWidth = 280;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(shoppableVideos.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const openModal = (index) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalPrev = () => {
    setModalIndex((prev) => (prev > 0 ? prev - 1 : shoppableVideos.length - 1));
  };

  const handleModalNext = () => {
    setModalIndex((prev) => (prev < shoppableVideos.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (isModalOpen && videoRefs.current[modalIndex]) {
      videoRefs.current[modalIndex].play();
    }
  }, [isModalOpen, modalIndex]);

  return (
    <section className="py-12 bg-brand-cream overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-brand-dark-brown">Shop the Look</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 hover:bg-brand-gold hover:text-white transition-colors"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === shoppableVideos.length - 1}
              className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 hover:bg-brand-gold hover:text-white transition-colors"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shoppableVideos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => openModal(index)}
              className="flex-shrink-0 w-[260px] cursor-pointer group"
            >
              {/* Video Card */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[9/16]">
                {/* Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt={video.product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-brand-dark-brown border-b-8 border-b-transparent ml-1" />
                  </div>
                </div>

                {/* Product Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <img
                      src={video.product.image}
                      alt={video.product.name}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-semibold truncate">
                        {video.product.name}
                      </h3>
                      <p className="text-brand-gold text-sm font-bold">
                        ₹{video.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 text-white hover:text-brand-gold transition-colors"
          >
            <HiX className="w-8 h-8" />
          </button>

          {/* Modal Content */}
          <div className="relative flex items-center gap-4 max-w-6xl w-full px-4">
            {/* Previous Button */}
            <button
              onClick={handleModalPrev}
              className="flex-shrink-0 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <HiChevronLeft className="w-6 h-6" />
            </button>

            {/* Video Container */}
            <div className="relative flex-1 max-w-[400px] mx-auto">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[9/16]">
                <video
                  ref={(el) => (videoRefs.current[modalIndex] = el)}
                  src={shoppableVideos[modalIndex].videoUrl}
                  poster={shoppableVideos[modalIndex].thumbnail}
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />

                {/* Video Controls */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? <HiVolumeOff className="w-5 h-5" /> : <HiVolumeUp className="w-5 h-5" />}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-brand-gold w-1/3" />
                </div>
              </div>

              {/* Product Panel */}
              <div className="mt-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={shoppableVideos[modalIndex].product.image}
                    alt={shoppableVideos[modalIndex].product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-dark-brown text-lg">
                      {shoppableVideos[modalIndex].product.name}
                    </h3>
                    <p className="text-brand-gold font-bold text-xl">
                      ₹{shoppableVideos[modalIndex].product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 bg-brand-dark-brown text-white font-bold rounded-lg hover:bg-brand-gold hover:text-brand-dark-brown transition-colors flex items-center justify-center gap-2">
                  <HiShoppingBag className="w-5 h-5" />
                  Shop Now
                </button>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleModalNext}
              className="flex-shrink-0 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <HiChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Side Videos Preview */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
            {shoppableVideos.slice(Math.max(0, modalIndex - 2), modalIndex).map((video, idx) => (
              <div
                key={video.id}
                onClick={() => setModalIndex(Math.max(0, modalIndex - 2) + idx)}
                className="w-16 h-24 rounded-lg overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
              >
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
            {shoppableVideos.slice(modalIndex + 1, modalIndex + 3).map((video, idx) => (
              <div
                key={video.id}
                onClick={() => setModalIndex(modalIndex + 1 + idx)}
                className="w-16 h-24 rounded-lg overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
              >
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .border-l-12 {
          border-left-width: 20px;
        }
      `}</style>
    </section>
  );
}

export default ShoppableVideoCarousel;
