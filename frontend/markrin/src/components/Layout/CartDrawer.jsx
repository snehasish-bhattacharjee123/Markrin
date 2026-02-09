import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { HiOutlineShoppingBag, HiOutlineTrash, HiPlus, HiMinus } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function CartDrawer({ drawerOpen, toggleCartDrawer }) {
  const { isAuthenticated, user } = useAuth();
  const { cart, loading, totalItems, subtotal, updateItem, removeItem } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!drawerOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [drawerOpen]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await updateItem(itemId, { quantity });
  };

  return (
    <>
      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          onClick={toggleCartDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[450px] h-[100dvh] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col overscroll-contain z-[60] ${drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <HiOutlineShoppingBag className="w-6 h-6 text-brand-dark-brown" />
            <h2 className="text-xl font-bold text-brand-dark-brown uppercase tracking-wider">
              Your Cart
            </h2>
            <span className="px-2 py-1 bg-brand-gold/20 text-brand-gold text-xs font-bold rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={toggleCartDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoMdClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow p-6 overflow-y-auto">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <HiOutlineShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Please login to view your cart</p>
              <Link
                to="/login"
                onClick={toggleCartDrawer}
                className="px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
              >
                Login
              </Link>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
            </div>
          ) : cart.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <HiOutlineShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400 mb-6">
                Looks like you haven't added anything yet.
              </p>
              <Link
                to="/collection/all"
                onClick={toggleCartDrawer}
                className="px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product?.slug || item.product?._id}`}
                    onClick={toggleCartDrawer}
                  >
                    <img
                      src={item.product?.images?.[0]?.url || "https://via.placeholder.com/100"}
                      alt={item.product?.name || "Product"}
                      className="w-20 h-20 object-cover rounded-lg hover:opacity-80 transition-opacity"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link
                      to={`/product/${item.product?.slug || item.product?._id}`}
                      onClick={toggleCartDrawer}
                    >
                      <h3 className="font-semibold text-brand-dark-brown text-sm line-clamp-1 hover:text-brand-gold transition-colors">
                        {item.product?.name || "Product"}
                      </h3>
                    </Link>
                    <div className="flex gap-2 mt-1">
                      {item.size && (
                        <span className="text-xs text-gray-500">Size: {item.size}</span>
                      )}
                      {item.color && (
                        <span className="text-xs text-gray-500">Color: {item.color}</span>
                      )}
                    </div>
                    <p className="font-bold text-brand-gold mt-1">
                      ${item.price?.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <HiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <HiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Checkout */}
        {isAuthenticated && cart.items?.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {/* Address Preview */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping To</h3>
              {user?.address?.street ? (
                <p className="text-sm text-brand-dark-brown">
                  {user.address.street}, {user.address.city}, {user.address.state}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No address set. Updated at Checkout.</p>
              )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-brand-dark-brown">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <Link
              to="/checkout"
              onClick={toggleCartDrawer}
              className="block w-full py-4 bg-brand-dark-brown text-white text-center font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={toggleCartDrawer}
              className="block w-full py-3 mt-2 text-center text-sm text-gray-500 hover:text-brand-dark-brown transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
