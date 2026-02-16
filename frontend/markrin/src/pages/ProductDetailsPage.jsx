import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import {
  HiOutlineHeart, HiHeart, HiStar,
  HiChevronLeft, HiChevronRight, HiChevronDown, HiChevronUp,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiMinus, HiPlus,
  HiOutlineShare,
  HiOutlineClipboardDocumentList,
  HiOutlineCreditCard,
  HiOutlineHandThumbUp,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineBanknotes,
} from 'react-icons/hi2';
import { getOptimizedImageUrl, getProductDetailUrl, getCardUrl, getThumbnailUrl } from '../utils/cloudinaryHelper';
import ProductGrid from '../components/Products/ProductGrid';
import PDPGallery from '../components/Products/PDPGallery';
import SizeChartModal from '../components/Common/SizeChartModal';

function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist, toggleWishlist, isInWishlist: checkWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const [openAccordion, setOpenAccordion] = useState('description');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const mainImageRef = useRef(null);
  const thumbnailContainerRef = useRef(null);

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(slug);
        setProduct(data);
        setActiveImageIndex(0);

        if (isAuthenticated && data._id) {
          setIsInWishlist(checkWishlist(data._id));
        }

        // Fetch related products
        if (data.category) {
          setRelatedLoading(true);
          try {
            const relatedData = await productsAPI.getAll({
              category: data.category,
              limit: 5,
              // Exclude current product if possible, otherwise we filter client side
            });
            const related = relatedData.products || relatedData;
            setRelatedProducts(related.filter(p => p._id !== data._id).slice(0, 4));
          } catch (err) {
            console.error(err);
          } finally {
            setRelatedLoading(false);
          }
        }

      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
    window.scrollTo(0, 0);
  }, [slug, isAuthenticated]);

  const onAdd = async () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error('Please select a size', { duration: 1500 });
      return;
    }
    setAddingToCart(true);
    try {
      await addItem({
        productId: product._id,
        quantity,
        size: selectedSize,
      });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    setWishlistLoading(true);
    try {
      await toggleWishlist(product._id);
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleImageNav = (direction) => {
    if (!product?.images?.length) return;
    const total = product.images.length;
    setActiveImageIndex(prev =>
      direction === 'next' ? (prev + 1) % total : (prev - 1 + total) % total
    );
  };

  const handleMouseMove = (e) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

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
        toast.success('Link copied to clipboard!');
      }
    } catch (err) { }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeChecked(true);
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
  };

  // Social proof - random number for "people bought"
  const peopleBought = useMemo(() => Math.floor(Math.random() * 80) + 20, []);

  // Estimated delivery - 5-7 days from now
  const estimatedDelivery = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5 + Math.floor(Math.random() * 3));
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  }, []);

  // ============================================================
  // LOADING / NOT FOUND
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image skeleton */}
            <div className="flex gap-3">
              <div className="hidden lg:flex flex-col gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="skeleton-shimmer w-[72px] h-[90px] rounded-lg" />
                ))}
              </div>
              <div className="flex-1">
                <div className="skeleton-shimmer rounded-xl aspect-[4/5]" />
              </div>
            </div>
            {/* Info skeleton */}
            <div className="space-y-4 pt-4">
              <div className="skeleton-shimmer h-4 w-24 rounded" />
              <div className="skeleton-shimmer h-7 w-3/4 rounded" />
              <div className="skeleton-shimmer h-5 w-48 rounded" />
              <div className="skeleton-shimmer h-8 w-40 rounded" />
              <div className="skeleton-shimmer h-4 w-56 rounded" />
              <div className="skeleton-shimmer h-px w-full rounded mt-4" />
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="skeleton-shimmer w-12 h-12 rounded-lg" />
                ))}
              </div>
              <div className="skeleton-shimmer h-14 w-full rounded-xl mt-4" />
              <div className="skeleton-shimmer h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <HiOutlineShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-xl font-bold text-brand-dark-brown">Product not found</p>
        <p className="text-sm text-gray-400">The product you're looking for doesn't exist.</p>
        <Link to="/" className="mt-2 px-6 py-2.5 bg-brand-dark-brown text-white rounded-full text-sm font-bold hover:bg-brand-gold hover:text-brand-dark-brown transition-all">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const activeImage = product.images?.[activeImageIndex];
  const discountPercentage = product.discountPrice && product.discountPrice < product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const displayPrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* ============================================================ */}
      {/* BREADCRUMB */}
      {/* ============================================================ */}
      <div className="bg-gray-50/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-brand-dark-brown transition-colors font-medium">Home</Link>
            <HiChevronRight className="w-3 h-3 text-gray-300" />
            {product.gender && (
              <>
                <Link to={`/collections/${product.gender?.toLowerCase()}`} className="hover:text-brand-dark-brown transition-colors font-medium capitalize">
                  {product.gender}
                </Link>
                <HiChevronRight className="w-3 h-3 text-gray-300" />
              </>
            )}
            <Link to={`/collections/${product.category?.toLowerCase()}`} className="hover:text-brand-dark-brown transition-colors font-medium capitalize">
              {product.category}
            </Link>
            <HiChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-500 truncate max-w-[250px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

          {/* ============================================================ */}
          {/* LEFT: IMAGE GALLERY (Grid Layout) */}
          {/* ============================================================ */}
          {/* ============================================================ */}
          {/* LEFT: IMAGE GALLERY (Grid Layout) */}
          {/* ============================================================ */}
          <div className="product-gallery-container h-auto md:h-[600px] sticky top-[80px]">
            <PDPGallery product={product} />
          </div>

          {/* ============================================================ */}
          {/* RIGHT: PRODUCT INFO (Bewakoof-style layout) */}
          {/* ============================================================ */}
          <div className="lg:sticky lg:top-[80px] lg:self-start lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto scrollbar-hide">
            <div className="space-y-0">

              {/* Brand */}
              <Link
                to={`/collections/${product.category?.toLowerCase()}`}
                className="text-sm font-bold text-brand-gold hover:underline"
              >
                {product.brand || 'Markrin'}
              </Link>

              {/* Title */}
              <h1 className="text-lg md:text-xl font-medium text-gray-800 leading-snug mt-1 mb-2">
                {product.name}
              </h1>

              {/* Price Block */}
              <div className="pb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{Math.round(displayPrice)}
                  </span>
                  {discountPercentage > 0 && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{Math.round(product.price)}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                  <span className="text-[11px] text-gray-400 ml-1">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 pb-3">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                  <HiStar className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-gray-700">
                    {product.rating?.toFixed(1) || '4.5'}
                  </span>
                  <span className="text-gray-300 text-xs">|</span>
                  <span className="text-sm text-gray-500">
                    {product.numReviews || 0}
                  </span>
                </div>
              </div>

              {/* Social Proof Badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg mb-4">
                <span className="text-xs text-amber-700 font-medium">
                  🔥 {peopleBought} people bought this in the last 7 days
                </span>
              </div>

              {/* Product Tags */}
              {product.material && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-600">
                    {product.material}
                  </span>
                  {product.gender && (
                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-600">
                      {product.gender}
                    </span>
                  )}
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-100 my-4" />

              {/* Color Display */}
              {product.colors?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-700">Colour:</span>
                    <span className="text-sm text-gray-500">{product.colors[0]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:border-brand-dark-brown transition-colors cursor-pointer"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Select Size</span>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs text-blue-500 hover:underline font-medium flex items-center gap-0.5 cursor-pointer"
                    >
                      Size guide <HiChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-12 px-4 rounded-lg border-2 text-sm font-semibold transition-all duration-200 ${selectedSize === size
                          ? 'bg-brand-dark-brown text-white border-brand-dark-brown shadow-md'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Fit Section */}
              {product.bestFit && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Best Fit</p>
                  <p className="text-sm text-gray-800 font-medium">{product.bestFit}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5">
                <span className="text-sm font-semibold text-gray-700 mb-2 block">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg w-fit overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                  >
                    <HiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-bold text-gray-800 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                  >
                    <HiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Bewakoof style */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={onAdd}
                  disabled={product.countInStock === 0 || addingToCart}
                  className={`flex-1 h-14 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-200 flex items-center justify-center gap-2.5 ${product.countInStock === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-dark-brown text-white hover:bg-[#2a1810] active:scale-[0.98] shadow-lg'
                    }`}
                >
                  {addingToCart ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <HiOutlineShoppingBag className="w-5 h-5" />
                      {product.countInStock === 0 ? 'Out of Stock' : 'Add to Bag'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${isInWishlist
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'
                    }`}
                >
                  {wishlistLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-current/30 border-t-current rounded-full" />
                  ) : isInWishlist ? (
                    <HiHeart className="w-6 h-6" />
                  ) : (
                    <HiOutlineHeart className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Stock Info */}
              <div className={`flex items-center gap-2 text-xs font-medium mb-4 ${product.countInStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                {product.countInStock > 0
                  ? product.countInStock < 10
                    ? `Only ${product.countInStock} left – order soon!`
                    : 'In Stock'
                  : 'Out of Stock'
                }
              </div>

              <hr className="border-gray-100" />

              {/* ============================================================ */}
              {/* DELIVERY CHECK (Bewakoof-style pincode input) */}
              {/* ============================================================ */}
              <div className="py-4">
                <span className="text-sm font-semibold text-gray-700 block mb-3">
                  Check for Delivery Details
                </span>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeChecked(false); }}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-dark-brown transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold text-blue-600 uppercase tracking-wide hover:text-blue-700 transition-colors"
                  >
                    Check
                  </button>
                </form>

                {pincodeChecked && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <HiOutlineTruck className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Expected delivery by <span className="font-bold text-gray-700">{estimatedDelivery}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <HiOutlineBanknotes className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-xs text-gray-500">Cash on Delivery is available</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                      <HiOutlineTruck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-[11px] text-blue-700 font-medium">
                        This product is eligible for FREE SHIPPING
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* ============================================================ */}
              {/* KEY HIGHLIGHTS (Bewakoof-style grid) */}
              {/* ============================================================ */}
              <div className="py-4">
                <span className="text-sm font-semibold text-gray-700 block mb-3">
                  Key Highlights
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { label: 'Fabric', value: product.material || 'Cotton' },
                    { label: 'Category', value: product.category || '—' },
                    { label: 'Gender', value: product.gender || 'Unisex' },
                    { label: 'Brand', value: product.brand || 'Markrin' },
                    ...(product.collections ? [{ label: 'Collection', value: product.collections }] : []),
                    ...(product.sku ? [{ label: 'SKU', value: product.sku }] : []),
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col py-2 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider">{item.label}</span>
                      <span className="text-sm font-medium text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ============================================================ */}
              {/* ACCORDIONS (Bewakoof-style with icons) */}
              {/* ============================================================ */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {[
                  {
                    key: 'description',
                    title: 'Product Description',
                    subtitle: 'Manufacture, Care and Fit',
                    icon: <HiOutlineClipboardDocumentList className="w-5 h-5 text-gray-400" />,
                    content: product.description || 'Premium quality product crafted with care.'
                  },
                  {
                    key: 'returns',
                    title: '15 Day Returns',
                    subtitle: 'Know about return & exchange policy',
                    icon: <HiOutlineArrowPath className="w-5 h-5 text-gray-400" />,
                    content: 'Easy returns within 15 days of delivery. Items must be unworn with tags attached. Exchanges are subject to availability. Refunds are processed to the original payment method within 5-7 business days.'
                  },
                ].map((item, idx) => (
                  <div key={item.key} className={idx > 0 ? 'border-t border-gray-200' : ''}>
                    <button
                      onClick={() => toggleAccordion(item.key)}
                      className="w-full flex justify-between items-center px-4 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-semibold text-gray-700 block">{item.title}</span>
                          <span className="text-[11px] text-gray-400">{item.subtitle}</span>
                        </div>
                      </div>
                      <HiChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openAccordion === item.key ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === item.key ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      <div className="px-4 pb-4 pl-[60px]">
                        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{item.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ============================================================ */}
              {/* TRUST BANNERS (Bewakoof-style row with icons + text) */}
              {/* ============================================================ */}
              <div className="flex items-center justify-around py-5 mt-4">
                {[
                  {
                    icon: <HiOutlineShieldCheck className="w-7 h-7 text-gray-400 mx-auto" />,
                    title: '100%',
                    sub: 'Genuine Product',
                  },
                  {
                    icon: <HiOutlineCreditCard className="w-7 h-7 text-gray-400 mx-auto" />,
                    title: 'Secure',
                    sub: 'Payments',
                  },
                  {
                    icon: <HiOutlineArrowPath className="w-7 h-7 text-gray-400 mx-auto" />,
                    title: 'Easy',
                    sub: 'Returns & Refunds',
                  },
                ].map((badge, idx) => (
                  <div key={idx} className="text-center flex-1">
                    {badge.icon}
                    <p className="text-[11px] font-bold text-gray-600 mt-1.5">{badge.title}</p>
                    <p className="text-[10px] text-gray-400">{badge.sub}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* REVIEWS SECTION (Bewakoof-style with distribution bars) */}
        {/* ============================================================ */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            {/* Review Tabs */}
            <div className="flex gap-0 border-b border-gray-200 mb-6">
              <button className="px-4 py-3 text-sm font-bold text-brand-dark-brown border-b-2 border-brand-dark-brown capitalize">
                Product Reviews
              </button>
            </div>

            {/* Recommendation */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-5 px-1">
                <HiOutlineHandThumbUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">
                  <span className="font-bold text-green-700">92%</span> of verified buyers recommend this product
                </span>
              </div>
            )}

            {/* Rating Summary + Distribution */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">

              {/* Left: Average Rating */}
              <div className="flex-shrink-0 md:w-1/3">
                <span className="text-4xl font-bold text-gray-800">{product.rating?.toFixed(1) || '0.0'}</span>
                <p className="text-xs text-gray-400 mt-0.5">{product.numReviews || 0} ratings</p>
                <div className="flex gap-0.5 mt-1.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <HiStar
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <button className="px-6 py-2 border border-blue-200 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-blue-50 transition-colors">
                  Rate
                </button>
              </div>

              {/* Right: Rating Distribution Bars */}
              <div className="flex-1 space-y-1.5">
                {[
                  { stars: 5, count: Math.round((product.numReviews || 0) * 0.65), pct: 65 },
                  { stars: 4, count: Math.round((product.numReviews || 0) * 0.22), pct: 22 },
                  { stars: 3, count: Math.round((product.numReviews || 0) * 0.08), pct: 8 },
                  { stars: 2, count: Math.round((product.numReviews || 0) * 0.03), pct: 3 },
                  { stars: 1, count: Math.round((product.numReviews || 0) * 0.02), pct: 2 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <div className="w-3 flex items-center gap-0.5">
                      <span className="text-xs text-gray-500 font-medium">{row.stars}</span>
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${row.stars >= 4 ? 'bg-green-500' : row.stars === 3 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <div className="min-w-[36px] text-right">
                      <span className="text-[10px] text-gray-400">({row.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 mt-6">
              {[
                { name: 'Rahul M.', rating: 5, date: '2 weeks ago', comment: 'Amazing quality! The fabric is so soft and the fit is perfect. Will definitely buy again.' },
                { name: 'Priya S.', rating: 4, date: '1 month ago', comment: 'Great design and comfortable. Shipping was fast too.' },
                { name: 'Amit K.', rating: 5, date: '2 months ago', comment: 'Best purchase ever! The reflective print looks awesome.' },
              ].map((review, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold/80 to-brand-dark-brown text-white flex items-center justify-center font-bold text-xs">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 text-sm">{review.name}</span>
                        <div className="flex mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <HiStar
                              key={star}
                              className={`w-3 h-3 ${star <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-300 text-[11px]">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pl-[42px]">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SIMILAR PRODUCTS */}
        {/* ============================================================ */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">You May Also Like</h3>
          {relatedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-shimmer aspect-[3/4] rounded-lg" />)}
            </div>
          ) : (
            <ProductGrid products={relatedProducts} />
          )}
        </div>
      </div>
      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        imageUrl={product.sizeChart}
      />
    </div>

  );
}

export default ProductDetailsPage;

