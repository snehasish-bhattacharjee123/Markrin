import React, { useState, useRef, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight, HiVolumeUp, HiVolumeOff, HiX, HiShoppingBag, HiPlay, HiCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';
import { productsAPI } from '../../api';

// Sample curated look videos - in production these would come from backend
const curatedLookVideos = [
    {
        id: 1,
        title: 'Urban Street Style',
        description: 'Elevate your everyday look with our signature oversized collection',
        videoUrl: 'https://cdn.shopify.com/videos/c/o/v/a0640b6602b94dada25de7bfb66f74a1.mp4',
        thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/a0640b6602b94dada25de7bfb66f74a1.thumbnail.0000000000.jpg?v=1769694969',
        badge: 'Trending Now',
        lookProducts: [
            { name: 'Freefall Oversized Tee', price: 1199, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/freefall-men-shirt-mydesignation-4264565.jpg?v=1757584339' },
            { name: 'Slim Fit Jeans', price: 1499, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/jeans-mydesignation.jpg' }
        ]
    },
    {
        id: 2,
        title: 'Casual Friday',
        description: 'Perfect for weekend brunch or casual office days',
        videoUrl: 'https://cdn.shopify.com/videos/c/o/v/a34a6a46ef254435a47870227b26344a.mp4',
        thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/a34a6a46ef254435a47870227b26344a.thumbnail.0000000000?v=1769163310',
        badge: 'New Arrival',
        lookProducts: [
            { name: 'Shadow Wolf Shirt', price: 1299, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/shadow-wolf-men-shirt-mydesignation-603557.jpg?v=1764335745' },
            { name: 'Chino Pants', price: 1199, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/chino-mydesignation.jpg' }
        ]
    },
    {
        id: 3,
        title: 'Evening Elegance',
        description: 'Sophisticated looks for your night out',
        videoUrl: 'https://cdn.shopify.com/videos/c/o/v/0f7da54a33ef4ca8a466a2dd7ca4d504.mp4',
        thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/0f7da54a33ef4ca8a466a2dd7ca4d504.thumbnail.0000000000?v=1769694974',
        badge: 'Premium',
        lookProducts: [
            { name: 'Heart Check Shirt', price: 1199, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/heart-check-shirt-for-men-men-shirt-mydesignation-6951747.jpg?v=1770852727' },
            { name: 'Tailored Trousers', price: 1899, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/trousers-mydesignation.jpg' }
        ]
    },
    {
        id: 4,
        title: 'Weekend Vibes',
        description: 'Comfortable and stylish for your weekend adventures',
        videoUrl: 'https://cdn.shopify.com/videos/c/o/v/d52fd8e4c322457e8793b56f870fd1c6.mp4',
        thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/d52fd8e4c322457e8793b56f870fd1c6.thumbnail.0000000000?v=1767876152',
        badge: 'Bestseller',
        lookProducts: [
            { name: 'Guardian Embroidered', price: 1699, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/guardian-embroidered-men-shirt-mydesignation-3437254.jpg?v=1765432003' },
            { name: 'Denim Shorts', price: 899, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/shorts-mydesignation.jpg' }
        ]
    },
    {
        id: 5,
        title: 'Festival Ready',
        description: 'Stand out at every festival and event',
        videoUrl: 'https://cdn.shopify.com/videos/c/o/v/25834326e83849039d1840147259b395.mp4',
        thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/25834326e83849039d1840147259b395.thumbnail.0000000000?v=1769694904',
        badge: 'Limited Edition',
        lookProducts: [
            { name: 'Red Leaf Embroidered', price: 1199, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/royal-embroidered-shirt-men-men-shirt-mydesignation-7184858.jpg?v=1768567976' },
            { name: 'Cargo Pants', price: 1399, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/cargo-mydesignation.jpg' }
        ]
    },
    {
        id: 6,
        title: 'Layer Up',
        description: 'Master the art of layering this season',
        videoUrl: 'https://cdn.shopify.com/videos/c/o/v/4450f28adff34c33929a59155193af03.mp4',
        thumbnail: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/preview_images/4450f28adff34c33929a59155193af03.thumbnail.0000000000?v=1767875220',
        badge: 'Winter Edit',
        lookProducts: [
            { name: 'Barong Hoodie', price: 1999, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/barong-hoodie-hoodie-mydesignation-2583044.jpg?v=1765535249' },
            { name: 'Joggers', price: 999, image: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/joggers-mydesignation.jpg' }
        ]
    }
];

// Sample products with variants for the demo (in production, fetch from API)
const sampleProducts = [
    {
        _id: '67b57b126322ad1eb3459e74',
        name: 'Freefall Oversized Tee',
        basePrice: 1199,
        images: [{ url: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/freefall-men-shirt-mydesignation-4264565.jpg?v=1757584339' }],
        variants: [
            { _id: 'var_s', size: 'S', price: 1199, stock: 10 },
            { _id: 'var_m', size: 'M', price: 1199, stock: 15 },
            { _id: 'var_l', size: 'L', price: 1199, stock: 8 },
            { _id: 'var_xl', size: 'XL', price: 1199, stock: 5 },
            { _id: 'var_xxl', size: 'XXL', price: 1199, stock: 3 }
        ]
    },
    {
        _id: '67b57b126322ad1eb3459e75',
        name: 'Shadow Wolf Oversized Tee',
        basePrice: 1299,
        images: [{ url: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/shadow-wolf-men-shirt-mydesignation-603557.jpg?v=1764335745' }],
        variants: [
            { _id: 'var_m2', size: 'M', price: 1299, stock: 12 },
            { _id: 'var_l2', size: 'L', price: 1299, stock: 10 },
            { _id: 'var_xl2', size: 'XL', price: 1299, stock: 6 }
        ]
    },
    {
        _id: '67b57b126322ad1eb3459e76',
        name: 'Heart Check Shirt',
        basePrice: 1199,
        images: [{ url: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/heart-check-shirt-for-men-men-shirt-mydesignation-6951747.jpg?v=1770852727' }],
        variants: [
            { _id: 'var_s3', size: 'S', price: 1199, stock: 8 },
            { _id: 'var_m3', size: 'M', price: 1199, stock: 14 },
            { _id: 'var_l3', size: 'L', price: 1199, stock: 9 },
            { _id: 'var_xl3', size: 'XL', price: 1199, stock: 4 }
        ]
    },
    {
        _id: '67b57b126322ad1eb3459e77',
        name: 'Guardian Embroidered',
        basePrice: 1699,
        images: [{ url: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/guardian-embroidered-men-shirt-mydesignation-3437254.jpg?v=1765432003' }],
        variants: [
            { _id: 'var_l4', size: 'L', price: 1699, stock: 7 },
            { _id: 'var_xl4', size: 'XL', price: 1699, stock: 5 },
            { _id: 'var_xxl4', size: 'XXL', price: 1699, stock: 3 }
        ]
    },
    {
        _id: '67b57b126322ad1eb3459e78',
        name: 'Royal Embroidered Shirt',
        basePrice: 1199,
        images: [{ url: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/royal-embroidered-shirt-men-men-shirt-mydesignation-7184858.jpg?v=1768567976' }],
        variants: [
            { _id: 'var_s5', size: 'S', price: 1199, stock: 6 },
            { _id: 'var_m5', size: 'M', price: 1199, stock: 11 },
            { _id: 'var_l5', size: 'L', price: 1199, stock: 8 }
        ]
    },
    {
        _id: '67b57b126322ad1eb3459e79',
        name: 'Barong Hoodie',
        basePrice: 1999,
        images: [{ url: 'https://cdn.shopify.com/s/files/1/0798/9710/0596/files/barong-hoodie-hoodie-mydesignation-2583044.jpg?v=1765535249' }],
        variants: [
            { _id: 'var_m6', size: 'M', price: 1999, stock: 9 },
            { _id: 'var_l6', size: 'L', price: 1999, stock: 12 },
            { _id: 'var_xl6', size: 'XL', price: 1999, stock: 7 },
            { _id: 'var_xxl6', size: 'XXL', price: 1999, stock: 4 }
        ]
    }
];

function CuratedStyleShopTheLook() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [videoProgress, setVideoProgress] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [products, setProducts] = useState(sampleProducts);
    const [loading, setLoading] = useState(false);
    const [modalVariants, setModalVariants] = useState([]);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const { addItem } = useCart();
    const scrollRef = useRef(null);
    const modalVideoRef = useRef(null);

    // Fetch products on mount (in production)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productsAPI.getFeatured();
                if (data && data.length > 0) {
                    // Map API products to our format
                    const mappedProducts = data.slice(0, 6).map((product, idx) => ({
                        _id: product._id,
                        name: product.name,
                        basePrice: product.basePrice || product.price,
                        images: product.images || [],
                        variants: product.variants || []
                    }));
                    setProducts(mappedProducts);
                }
            } catch (error) {
                console.log('Using sample products - API not available');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scrollToIndex = (index) => {
        if (scrollRef.current) {
            const cardWidth = 296;
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
        const newIndex = Math.min(curatedLookVideos.length - 1, activeIndex + 1);
        setActiveIndex(newIndex);
        scrollToIndex(newIndex);
    };

    const openModal = (index) => {
        setModalIndex(index);
        setSelectedProduct(products[index] || sampleProducts[index]);
        setSelectedSize('');
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalVariants([]);
        setSelectedSize('');
        document.body.style.overflow = 'unset';
    };

    const handleModalPrev = () => {
        setModalIndex((prev) => (prev > 0 ? prev - 1 : curatedLookVideos.length - 1));
        setVideoProgress(0);
        setSelectedSize('');
        setSelectedProduct(products[modalIndex - 1 >= 0 ? modalIndex - 1 : curatedLookVideos.length - 1] || sampleProducts[modalIndex - 1 >= 0 ? modalIndex - 1 : curatedLookVideos.length - 1]);
    };

    const handleModalNext = () => {
        setModalIndex((prev) => (prev < curatedLookVideos.length - 1 ? prev + 1 : 0));
        setVideoProgress(0);
        setSelectedSize('');
        setSelectedProduct(products[modalIndex + 1 < curatedLookVideos.length ? modalIndex + 1 : 0] || sampleProducts[modalIndex + 1 < curatedLookVideos.length ? modalIndex + 1 : 0]);
    };

    const handleTimeUpdate = (e) => {
        const progress = (e.target.currentTime / e.target.duration) * 100;
        setVideoProgress(progress);
    };

    const handleAddToBag = async () => {
        if (!selectedProduct) {
            toast.error('Please select a product first');
            return;
        }

        if (!selectedSize) {
            toast.error('Please select a size first');
            return;
        }

        // Find the variant with the selected size
        const variant = modalVariants.find(v => v.size === selectedSize);

        if (!variant || !variant._id) {
            toast.error('Selected size is not available');
            return;
        }

        // Use standard countInStock check if available
        if (variant.countInStock !== undefined && variant.countInStock <= 0) {
            toast.error('This size is currently out of stock');
            return;
        }

        setIsAdding(true);
        try {
            await addItem({
                variant_id: variant._id,
                quantity: 1
            });
            toast.success(`${selectedProduct.name} (${selectedSize}) added to cart!`);
            closeModal();
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('Failed to add to cart. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        if (!isModalOpen || !selectedProduct) {
            setModalVariants([]);
            return;
        }

        const fetchVariants = async () => {
            setLoadingVariants(true);
            try {
                // If the product is a sample product, just use its variants
                if (selectedProduct.variants && selectedProduct.variants.length > 0 && selectedProduct.variants[0]._id.startsWith('var_')) {
                    setModalVariants(selectedProduct.variants);
                } else if (selectedProduct._id) {
                    const variantsData = await productsAPI.getVariants(selectedProduct._id);
                    const vList = variantsData.data || variantsData || [];
                    setModalVariants(vList);
                }
            } catch (err) {
                console.error("Failed to load variants", err);
                toast.error("Could not load product sizes.");
                setModalVariants([]);
            } finally {
                setLoadingVariants(false);
            }
        };

        fetchVariants();
    }, [isModalOpen, selectedProduct]);

    useEffect(() => {
        if (isModalOpen && modalVideoRef.current) {
            modalVideoRef.current.play().catch(err => console.log("Auto-play blocked"));
        }
    }, [isModalOpen, modalIndex]);

    // Get current product for modal
    const currentProduct = products[modalIndex] || sampleProducts[modalIndex] || selectedProduct;

    return (
        <section className="py-12 md:py-20 bg-gradient-to-b from-brand-cream to-white overflow-hidden">
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
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-brand-dark-brown/60 text-sm md:text-base max-w-lg mt-2"
                        >
                            Discover our handpicked collection of stylish products, perfectly curated to elevate your wardrobe.
                        </motion.p>
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
                            disabled={activeIndex === curatedLookVideos.length - 1}
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
                    {curatedLookVideos.map((video, index) => (
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
                                    alt={video.title}
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
                                    <h3 className="text-white text-[12px] md:text-sm font-bold truncate mb-1">
                                        {video.title}
                                    </h3>
                                    <p className="text-white/70 text-[10px] md:text-xs line-clamp-2">
                                        {video.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <HiShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
                                        <span className="text-brand-gold text-[10px] md:text-xs font-bold">Shop the Look</span>
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
                            width: `${((activeIndex + 1) / curatedLookVideos.length) * 100}%`
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* Shop More CTA */}
                <div className="text-center mt-8 md:mt-12">
                    <p className="text-brand-dark-brown/60 text-sm mb-4">Complete your outfit with these complementary pieces</p>
                    <button className="px-8 py-3 bg-brand-dark-brown text-white font-bold rounded-full hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 shadow-lg">
                        Explore Full Collection
                    </button>
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
                                        key={curatedLookVideos[modalIndex].id}
                                        src={curatedLookVideos[modalIndex].videoUrl}
                                        poster={curatedLookVideos[modalIndex].thumbnail}
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

                                    {/* Look Title Overlay */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-brand-gold/90 text-brand-dark-brown text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {curatedLookVideos[modalIndex].badge}
                                        </span>
                                    </div>
                                </div>

                                {/* Enhanced Product Panel */}
                                <div className="flex-1 w-full max-w-[420px] lg:max-w-none mx-auto flex flex-col justify-center max-h-[90vh] lg:max-h-full">
                                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-y-auto overflow-x-hidden h-full flex flex-col justify-between scrollbar-hide">
                                        {/* Background Accent */}
                                        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none" />

                                        {/* Content Wrapper to ensure z-index over background */}
                                        <div className="relative z-10 space-y-4 md:space-y-6 flex-1 flex flex-col">
                                            {/* Look Title */}
                                            <div className="mb-4 md:mb-6">
                                                <h3 className="font-black text-brand-dark-brown text-xl md:text-2xl">
                                                    {curatedLookVideos[modalIndex].title}
                                                </h3>
                                                <p className="text-brand-dark-brown/60 text-sm mt-1">
                                                    {curatedLookVideos[modalIndex].description}
                                                </p>
                                            </div>

                                            {/* Product Display */}
                                            <div className="space-y-6 md:space-y-8">
                                                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-6">
                                                    <img
                                                        src={currentProduct?.images?.[0]?.url || curatedLookVideos[modalIndex].lookProducts[0].image}
                                                        alt={currentProduct?.name || curatedLookVideos[modalIndex].lookProducts[0].name}
                                                        className="w-full sm:w-48 lg:w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] object-cover shadow-lg border border-brand-dark-brown/5"
                                                    />
                                                    <div>
                                                        <span className="text-brand-gold font-bold text-[10px] md:text-xs tracking-widest uppercase mb-1 md:mb-2 block">Featured Product</span>
                                                        <h3 className="font-black text-brand-dark-brown text-lg md:text-2xl leading-tight line-clamp-2">
                                                            {currentProduct?.name || curatedLookVideos[modalIndex].lookProducts[0].name}
                                                        </h3>
                                                        <p className="text-brand-gold font-black text-lg md:text-2xl mt-1 md:mt-2">
                                                            ₹{(currentProduct?.basePrice || curatedLookVideos[modalIndex].lookProducts[0].price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Size Selection */}
                                                <div className="space-y-4 md:space-y-6">
                                                    <div className="space-y-2 md:space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-black text-brand-dark-brown/40 uppercase tracking-widest">Select Size</span>
                                                            <button className="text-[10px] font-bold text-brand-gold underline hover:text-brand-dark-brown transition-colors">Size Guide</button>
                                                        </div>

                                                        {loadingVariants ? (
                                                            <div className="flex items-center gap-2 py-2">
                                                                <div className="w-5 h-5 border-2 border-brand-dark-brown/30 border-t-brand-dark-brown rounded-full animate-spin" />
                                                                <span className="text-xs text-brand-dark-brown/60">Loading sizes...</span>
                                                            </div>
                                                        ) : modalVariants.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {[...new Map(modalVariants.map(v => [v.size, v])).values()].map(variant => {
                                                                    const isOutOfStock = variant.countInStock !== undefined && variant.countInStock <= 0;
                                                                    const isSelected = selectedSize === variant.size;
                                                                    return (
                                                                        <button
                                                                            key={variant.size}
                                                                            onClick={() => !isOutOfStock && setSelectedSize(variant.size)}
                                                                            disabled={isOutOfStock}
                                                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-2 flex items-center justify-center text-xs md:text-sm font-black transition-all duration-300 relative
                                                                            ${isSelected
                                                                                    ? 'bg-brand-dark-brown border-brand-dark-brown text-white shadow-lg shadow-brand-dark-brown/20 z-10'
                                                                                    : 'bg-white border-brand-dark-brown/10 text-brand-dark-brown hover:border-brand-gold hover:text-brand-gold'
                                                                                }
                                                                            ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : ''}
                                                                        `}
                                                                        >
                                                                            {isSelected && <HiCheck className="w-4 h-4 mr-0.5" />}
                                                                            {variant.size}
                                                                            {isOutOfStock && (
                                                                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-20">
                                                                                    <div className="w-full h-[1.5px] bg-gray-300 rotate-45 transform origin-center"></div>
                                                                                </div>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs font-medium text-red-500 py-2">This product is currently unavailable.</div>
                                                        )}
                                                    </div>

                                                    <p className="text-brand-dark-brown/60 text-[11px] md:text-sm leading-relaxed hidden sm:block">
                                                        Elevate your everyday wardrobe with our signature {currentProduct?.name || curatedLookVideos[modalIndex].lookProducts[0].name}.
                                                        Crafted from premium sustainable fabrics for a perfect fit and all-day comfort.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={handleAddToBag}
                                                disabled={isAdding || !selectedSize}
                                                className="w-full mt-8 md:mt-12 py-4 md:py-5 bg-brand-dark-brown text-white font-black text-sm md:text-lg rounded-[1.25rem] md:rounded-2xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-dark-brown/20 group disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isAdding ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <HiShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                                                        {selectedSize ? `Add to Cart - ₹${currentProduct?.basePrice || curatedLookVideos[modalIndex].lookProducts[0].price}` : 'Select Size'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
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

export default CuratedStyleShopTheLook;
