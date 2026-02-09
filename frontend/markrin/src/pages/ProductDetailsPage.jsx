import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsAPI, wishlistAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi2';

function ProductDetailsPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [openAccordion, setOpenAccordion] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  useEffect(() => {
    const run = async () => {
      try {
        const data = await productsAPI.getById(slug);
        setProduct(data);
        setActiveImage(data.images?.[0]?.url);

        // Check if product is in wishlist
        if (isAuthenticated && data._id) {
          try {
            const wishlistCheck = await wishlistAPI.check(data._id);
            setIsInWishlist(wishlistCheck.isInWishlist);
          } catch (err) {
            // Ignore wishlist check errors
          }
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [slug, isAuthenticated]);

  const onAdd = async () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error('Please select a size', {
        duration: 1000,
      });
      return;
    }

    await addItem({
      productId: product._id,
      quantity,
      size: selectedSize,
    });

    toast.success('Added to cart');
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistAPI.remove(product._id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.add(product._id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-spin h-10 w-10 border-b-2 border-brand-gold rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center py-20 bg-brand-cream min-h-screen">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ================= LEFT: IMAGE SECTION ================= */}
          <div>
            {/* MAIN IMAGE */}
            <div className="mb-4 relative overflow-hidden rounded-2xl bg-white shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full rounded-2xl object-cover"
              />
              {product.isNewArrival && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase rounded-full">
                  New
                </span>
              )}
              {product.isFeatured && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-brand-gold text-brand-dark-brown text-xs font-bold uppercase rounded-full">
                  Featured
                </span>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={product.name}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all
                    ${activeImage === img.url ? 'border-brand-gold' : 'border-gray-200 hover:border-brand-gold/50'}
                  `}
                />
              ))}
            </div>
          </div>



          {/* ================= RIGHT: PRODUCT INFO ================= */}
          <div className="md:ml-6">
            <p className="text-xs uppercase tracking-wider text-brand-gold font-bold mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark-brown mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-brand-dark-brown">
                ₹{product.price?.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400">Price inclusive of all taxes</span>
            </div>

            {/* Color Display */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-sm uppercase tracking-wider text-brand-dark-brown mb-3">
                  Available Colors
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SIZE SELECTION ================= */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-sm uppercase tracking-wider text-brand-dark-brown mb-3">
                  Select Size
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-lg border-2 text-sm font-bold uppercase transition-all
                        ${selectedSize === size
                          ? 'bg-brand-dark-brown text-white border-brand-dark-brown'
                          : 'border-gray-200 hover:border-brand-gold text-gray-600'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= QUANTITY ================= */}
            <div className="mb-6">
              <p className="font-semibold text-sm uppercase tracking-wider text-brand-dark-brown mb-3">Quantity</p>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors text-lg font-bold"
                >-</button>

                <span className="px-4 py-2 text-lg font-semibold min-w-[50px] text-center">{quantity}</span>

                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors text-lg font-bold"
                >+</button>
              </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={onAdd}
                disabled={product.countInStock === 0}
                className={`flex-1 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${product.countInStock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-dark-brown text-white hover:bg-brand-gold hover:text-brand-dark-brown'
                  }`}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`px-5 rounded-lg border-2 transition-all ${isInWishlist
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                  }`}
              >
                {wishlistLoading ? (
                  <div className="animate-spin h-5 w-5 border-b-2 border-current rounded-full"></div>
                ) : isInWishlist ? (
                  <HiHeart className="w-6 h-6" />
                ) : (
                  <HiOutlineHeart className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Stock Info */}
            <p className={`text-sm mb-6 ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.countInStock > 0 ? `✓ ${product.countInStock} items in stock` : '✗ Out of stock'}
            </p>

            {/* ================= PRODUCT ACCORDION ================= */}
            <div className="border-t border-gray-200 pt-6">
              {[
                { key: 'details', title: 'Product Details', content: `Material: ${product.material || 'Premium Quality'}\nGender: ${product.gender}` },
                { key: 'description', title: 'Product Description', content: product.description },
                { key: 'care', title: 'Care Instructions', content: 'Machine wash cold with similar colors. Do not bleach. Tumble dry low. Iron on low heat if needed.' },
              ].map(item => (
                <div key={item.key} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleAccordion(item.key)}
                    className="w-full flex justify-between items-center py-4 font-semibold text-brand-dark-brown hover:text-brand-gold transition-colors"
                  >
                    {item.title}
                    <span className={`text-brand-gold transition-transform duration-200 ${openAccordion === item.key ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${openAccordion === item.key ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'
                    }`}>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;