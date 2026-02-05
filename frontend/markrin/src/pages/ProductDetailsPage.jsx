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

  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  useEffect(() => {
    const run = async () => {
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
        setActiveImage(data.images?.[0]?.url);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-black rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center py-20">Product not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ================= LEFT: IMAGE SECTION ================= */}
        <div>
          {/* MAIN IMAGE */}
          <div className="mb-4">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full rounded-lg object-cover"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 overflow-x-auto">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={product.name}
                onClick={() => setActiveImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border
                  ${activeImage === img.url ? 'border-black' : 'border-gray-300'}
                `}
              />
            ))}
          </div>
        </div>



        {/* ================= RIGHT: PRODUCT INFO ================= */}
        <div className="md:w-1/1 md:ml-10">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{product.category}</p>

          <div className="text-2xl font-bold mb-2">
            ₹ {product.price}
          </div>
          <p className="text-xs text-gray-400 mb-6">Price inclusive of all taxes</p>

          {/* ================= SIZE SELECTION ================= */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-2">
                Please select a size
              </p>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold
                      ${selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:border-black'
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
            <p className="font-semibold mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded"
              >-</button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >+</button>
            </div>
          </div>
          {/* <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-3 py-2 rounded-md"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select> */}
          {/* </div> */}


          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={onAdd}
              className="flex-1 bg-brand-dark-brown text-white py-4 rounded-md font-bold uppercase"
            >
              Add to Cart
            </button>

            <button className="border px-6 rounded-md">
              ❤
            </button>
          </div>

          {/* ================= PRODUCT ACCORDION ================= */}


          {/* ACCORDION */}
          <div className="border-t pt-6 ">
            {[
              { key: 'details', title: 'Product Details', content: product.material || 'Cotton Blend' },
              { key: 'description', title: 'Product Description', content: product.description },
              { key: 'artist', title: "Artist’s Details", content: 'Designed by in-house artists.' },
            ].map(item => (
              <div key={item.key} className="border-b">
                <button
                  onClick={() => toggleAccordion(item.key)}
                  className="w-full flex justify-between py-4 font-semibold"
                >
                  {item.title}
                  <span>{openAccordion === item.key ? '-' : '+'}</span>
                </button>

                {openAccordion === item.key && (
                  <p className="pb-4 text-sm text-gray-600">{item.content}</p>
                )}
              </div>
            ))}
          </div>


          {/* ================= EXTRA INFO ================= */}
          <p className="text-sm text-gray-600 mt-6">
            {product.description}
          </p>

          <p className="text-xs text-gray-500">
            In stock: {product.countInStock}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;