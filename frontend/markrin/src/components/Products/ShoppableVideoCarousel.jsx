import React, { useState, useRef, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight, HiVolumeUp, HiVolumeOff, HiX, HiShoppingBag, HiPlay } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

const shoppableVideos = [
  {
    id: 1,
    productId: '67b57b126322ad1eb3459e74', // Real product ID from DB
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/a0640b6602b94dada25de7bfb66f74a1.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/a0640b6602b94dada25de7bfb66f74a1.thumbnail.0000000000.jpg?v=1769694969',
    badge: 'Trending',
    product: {
      name: 'Freefall',
      price: 1199,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/freefall-men-shirt-mydesignation-4264565.jpg?v=1757584339',
      slug: 'freefall-oversized-tee',
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
  },
  {
    id: 2,
    productId: '67b57b126322ad1eb3459e75', // Real product ID from DB
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/a34a6a46ef254435a47870227b26344a.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/a34a6a46ef254435a47870227b26344a.thumbnail.0000000000.jpg?v=1769163310',
    badge: 'New Arrival',
    product: {
      name: 'Shadow Wolf',
      price: 1299,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/shadow-wolf-men-shirt-mydesignation-603557.jpg?v=1764335745',
      slug: 'shadow-wolf-oversized-tee',
      availableSizes: ['M', 'L', 'XL']
    }
  },
  {
    id: 3,
    productId: '67b57b126322ad1eb3459e76',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/0f7da54a33ef4ca8a466a2dd7ca4d504.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/0f7da54a33ef4ca8a466a2dd7ca4d504.thumbnail.0000000000.jpg?v=1769694974',
    product: {
      name: 'Heart Check Shirt',
      price: 1199,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/heart-check-shirt-for-men-men-shirt-mydesignation-6951747.jpg?v=1770852727',
      slug: 'heart-check-shirt',
      availableSizes: ['S', 'M', 'L', 'XL']
    }
  },
  {
    id: 4,
    productId: '67b57b126322ad1eb3459e77',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/d52fd8e4c322457e8793b56f870fd1c6.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/d52fd8e4c322457e8793b56f870fd1c6.thumbnail.0000000000.jpg?v=1767876152',
    product: {
      name: 'Guardian Embroidered',
      price: 1699,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/guardian-embroidered-men-shirt-mydesignation-3437254.jpg?v=1765432003',
      slug: 'guardian-embroidered',
      availableSizes: ['L', 'XL', 'XXL']
    }
  },
  {
    id: 5,
    productId: '67b57b126322ad1eb3459e78',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/25834326e83849039d1840147259b395.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/25834326e83849039d1840147259b395.thumbnail.0000000000.jpg?v=1769694904',
    product: {
      name: 'Red Leaf Embroidered',
      price: 1199,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/royal-embroidered-shirt-men-men-shirt-mydesignation-7184858.jpg?v=1768567976',
      slug: 'red-leaf-embroidered',
      availableSizes: ['S', 'M', 'L']
    }
  },
  {
    id: 6,
    productId: '67b57b126322ad1eb3459e79',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/4450f28adff34c33929a59155193af03.mp4',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/4450f28adff34c33929a59155193af03.thumbnail.0000000000.jpg?v=1767875220',
    product: {
      name: 'Barong Hoodie',
      price: 1999,
      image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/barong-hoodie-hoodie-mydesignation-2583044.jpg?v=1765535249',
      slug: 'barong-hoodie',
      availableSizes: ['M', 'L', 'XL', 'XXL']
    }
  }
];

function ShoppableVideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();
  const scrollRef = useRef(null);
  const modalVideoRef = useRef(null);

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const cardWidth = 296; // card width (280) + gap (16)
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
    setSelectedSize('');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleModalPrev = () => {
    setModalIndex((prev) => (prev > 0 ? prev - 1 : shoppableVideos.length - 1));
    setVideoProgress(0);
    setSelectedSize('');
  };

  const handleModalNext = () => {
    setModalIndex((prev) => (prev < shoppableVideos.length - 1 ? prev + 1 : 0));
    setVideoProgress(0);
    setSelectedSize('');
  };

  const handleTimeUpdate = (e) => {
    const progress = (e.target.currentTime / e.target.duration) * 100;
    setVideoProgress(progress);
  };

  const handleAddToBag = async () => {
    const activeVideo = shoppableVideos[modalIndex];

    if (!selectedSize) {
      toast.error('Please select a size first');
      return;
    }

    setIsAdding(true);
    try {
      await addItem({
        productId: activeVideo.productId,
        quantity: 1,
        size: selectedSize
      });
      // Success toast is already handled in CartContext
    } catch (error) {
      console.error('Failed to add to bag:', error);
      toast.error('Failed to add to bag. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(err => console.log("Auto-play blocked"));
    }
  }, [isModalOpen, modalIndex]);

  return (
    <section className="py-12 md:py-20 bg-brand-cream overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="space-y-1 md:space-y-2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-gold font-bold tracking-widest uppercase text-xs md:text-sm block"
            >
              Curated Style
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black text-brand-dark-brown"
            >
              Shop the <span className="text-brand-gold italic">Look</span>
            </motion.h2>
          </div>

          <div className="flex gap-3 md:gap-4 self-end md:self-auto">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="group w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-brand-dark-brown/10 flex items-center justify-center bg-white text-brand-dark-brown disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-dark-brown hover:text-white transition-all duration-300 shadow-sm"
            >
              <HiChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === shoppableVideos.length - 1}
              className="group w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-brand-dark-brown/10 flex items-center justify-center bg-white text-brand-dark-brown disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-dark-brown hover:text-white transition-all duration-300 shadow-sm"
            >
              <HiChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-8 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shoppableVideos.map((video, index) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -10 }}
              onClick={() => openModal(index)}
              className="flex-shrink-0 w-[240px] md:w-[280px] cursor-pointer"
            >
              {/* Video Card */}
              <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-900 aspect-[9/16] shadow-xl group">
                {/* Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt={video.product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Glassy Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-brown/80 via-transparent to-black/20" />

                {/* Badge */}
                {video.badge && (
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-brand-gold text-brand-dark-brown text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {video.badge}
                    </span>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
                  >
                    <HiPlay className="w-6 h-6 md:w-8 md:h-8 ml-0.5 md:ml-1" />
                  </motion.div>
                </div>

                {/* Product Info Reveal */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                  <div className="flex items-center gap-2 md:gap-3">
                    <img
                      src={video.product.image}
                      alt={video.product.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl object-cover border-2 border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-[12px] md:text-sm font-bold truncate">
                        {video.product.name}
                      </h3>
                      <p className="text-brand-gold text-[10px] md:text-xs font-black">
                        ₹{video.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-1.5 md:p-2 rounded-full bg-brand-gold text-brand-dark-brown">
                      <HiShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Scroll Progress */}
        <div className="w-full h-1 bg-brand-dark-brown/5 rounded-full mt-2 md:mt-4 relative max-w-[200px] md:max-w-xs mx-auto overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-brand-gold rounded-full"
            animate={{
              width: `${((activeIndex + 1) / shoppableVideos.length) * 100}%`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-dark-brown/60 backdrop-blur-2xl flex items-center justify-center overflow-y-auto"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={closeModal}
              className="fixed top-4 right-4 md:top-8 md:right-8 z-[110] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
            >
              <HiX className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>

            {/* Modal Content */}
            <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-6xl w-full px-4 md:px-6 py-6 md:py-12 min-h-screen md:min-h-0">

              {/* Navigation Buttons (Desktop) */}
              <button
                onClick={handleModalPrev}
                className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white items-center justify-center hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300"
              >
                <HiChevronLeft className="w-6 h-6" />
              </button>

              {/* Central Video & Product Section */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch w-full max-w-5xl bg-transparent"
              >
                {/* Video Container */}
                <div className="relative flex-shrink-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-black aspect-[9/16] shadow-2xl w-full max-w-[320px] md:max-w-[420px] mx-auto border-4 border-white/10">
                  <video
                    ref={modalVideoRef}
                    key={shoppableVideos[modalIndex].id}
                    src={shoppableVideos[modalIndex].videoUrl}
                    poster={shoppableVideos[modalIndex].thumbnail}
                    onTimeUpdate={handleTimeUpdate}
                    loop
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover"
                  />

                  {/* Video Controls Layer */}
                  <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start pointer-events-auto">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center border border-white/20"
                      >
                        {isMuted ? <HiVolumeOff className="w-4 h-4 md:w-5 md:h-5" /> : <HiVolumeUp className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden mb-1 md:mb-2">
                      <motion.div
                        className="h-full bg-brand-gold"
                        style={{ width: `${videoProgress}%` }}
                        transition={{ type: "tween", ease: "linear" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Product Panel */}
                <div className="flex-1 w-full max-w-[420px] lg:max-w-none mx-auto flex flex-col justify-center">
                  <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="space-y-6 md:space-y-8">
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-6">
                        <img
                          src={shoppableVideos[modalIndex].product.image}
                          alt={shoppableVideos[modalIndex].product.name}
                          className="w-full sm:w-48 lg:w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] object-cover shadow-lg border border-brand-dark-brown/5"
                        />
                        <div>
                          <span className="text-brand-gold font-bold text-[10px] md:text-xs tracking-widest uppercase mb-1 md:mb-2 block">Premium Collection</span>
                          <h3 className="font-black text-brand-dark-brown text-2xl md:text-4xl leading-tight">
                            {shoppableVideos[modalIndex].product.name}
                          </h3>
                          <p className="text-brand-gold font-black text-2xl md:text-3xl mt-2 md:mt-4">
                            ₹{shoppableVideos[modalIndex].product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-brand-dark-brown/40 uppercase tracking-widest">Select Size</span>
                            <button className="text-[10px] font-bold text-brand-gold underline">Size Guide</button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {shoppableVideos[modalIndex].product.availableSizes.map(size => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-2 flex items-center justify-center text-xs md:text-sm font-black transition-all duration-300 ${selectedSize === size
                                  ? 'bg-brand-dark-brown border-brand-dark-brown text-white shadow-lg shadow-brand-dark-brown/20'
                                  : 'bg-white border-brand-dark-brown/5 text-brand-dark-brown/60 hover:text-brand-gold'
                                  }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <p className="text-brand-dark-brown/60 text-[11px] md:text-sm leading-relaxed hidden sm:block">
                          Elevate your everyday wardrobe with our signature {shoppableVideos[modalIndex].product.name}.
                          Crafted from premium sustainable fabrics for a perfect fit and all-day comfort.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToBag}
                      disabled={isAdding}
                      className="w-full mt-8 md:mt-12 py-4 md:py-5 bg-brand-dark-brown text-white font-black text-sm md:text-lg rounded-[1.25rem] md:rounded-2xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-dark-brown/20 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <HiShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                          Add to Bag
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Buttons (Desktop Right) */}
              <button
                onClick={handleModalNext}
                className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white items-center justify-center hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300"
              >
                <HiChevronRight className="w-6 h-6" />
              </button>

              {/* Mobile Navigation Controls */}
              <div className="md:hidden flex gap-4 w-full justify-center pb-8 border-none bg-transparent">
                <button
                  onClick={handleModalPrev}
                  className="w-12 h-12 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center"
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleModalNext}
                  className="w-12 h-12 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center"
                >
                  <HiChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default ShoppableVideoCarousel;
