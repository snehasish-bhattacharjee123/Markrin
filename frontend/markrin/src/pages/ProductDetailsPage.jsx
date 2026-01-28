import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsAPI } from '../api';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
      } catch (err) {
        setProduct(null);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center py-20 px-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-md w-full text-center">
          <p className="text-brand-dark-brown font-bold mb-2">Failed to load product</p>
          <p className="text-sm text-gray-500 mb-5 break-words">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center py-20">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/600';

  const onAdd = async () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (product.colors?.length && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    await addItem({
      productId: product._id,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <img src={imageUrl} alt={product.name} className="w-full h-[560px] object-cover" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-brand-dark-brown mb-3">{product.name}</h1>
            <p className="text-2xl font-black text-brand-gold mb-6">${product.price?.toFixed(2)}</p>
            <p className="text-gray-600 mb-8">{product.description}</p>

            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Color</label>
                <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                  <option value="">Select</option>
                  {product.colors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Size</label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                  <option value="">Select</option>
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-12 py-3 text-xl">−</button>
                <span className="w-10 text-center font-bold text-brand-dark-brown">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="w-12 py-3 text-xl">+</button>
              </div>
              <button onClick={onAdd} className="flex-1 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all">
                Add to Cart
              </button>
            </div>

            <p className="text-xs text-gray-400">In stock: {product.countInStock}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
