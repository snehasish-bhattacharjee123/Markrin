import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import StripePayment from '../components/Checkout/StripePayment';
import { RiDeleteBinLine } from 'react-icons/ri';
import { HiCheckCircle, HiXCircle, HiSearch } from 'react-icons/hi2';
import { validatePincode, getAddressFromPincode } from '../utils/pincodeService';

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart,
    subtotal,
    totalItems,
    refreshCart,
    updateItem,
    removeItem,
  } = useCart();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [pincodeValidating, setPincodeValidating] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [pincodeSuccess, setPincodeSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setPostalCode(user.address.postalCode || '');
        setCountry(user.address.country || 'India');
      }
    }
  }, [user]);

  const placeOrder = async (e) => {
    if (e) e.preventDefault();

    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!street || !city || !state || !postalCode) {
      toast.error('Please fill in all address fields');
      return;
    }

    setSubmitting(true);
    try {
      const order = await ordersAPI.create(
        { street, city, state, postalCode, country },
        paymentMethod
      );

      if (paymentMethod === 'ONLINE') {
        setActiveOrder(order);
        setSubmitting(false);
        return;
      }

      await refreshCart();
      toast.success('Order placed successfully');
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await updateItem(itemId, { quantity });
  };

  const updateSize = async (itemId, size) => {
    await updateItem(itemId, { size });
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setPostalCode(value);
    setPincodeError('');
    setPincodeSuccess(false);

    if (value.length === 6) {
      if (!validatePincode(value)) {
        setPincodeError('Please enter a valid 6-digit pincode');
        return;
      }

      setPincodeValidating(true);
      try {
        const result = await getAddressFromPincode(value);
        if (result.success) {
          setCity(result.data.city);
          setState(result.data.state);
          setCountry(result.data.country || 'India');
          setPincodeSuccess(true);
          toast.success(`Address found: ${result.data.city}, ${result.data.state}`);
        } else {
          setPincodeError(result.error || 'Invalid pincode');
          toast.error('Could not validate pincode');
        }
      } catch (err) {
        setPincodeError('Failed to validate pincode');
      } finally {
        setPincodeValidating(false);
      }
    }
  };

  const validatePincodeManually = async () => {
    if (!postalCode || postalCode.length !== 6) {
      setPincodeError('Please enter a valid 6-digit pincode');
      return;
    }

    setPincodeValidating(true);
    setPincodeError('');
    setPincodeSuccess(false);

    try {
      const result = await getAddressFromPincode(postalCode);
      if (result.success) {
        setCity(result.data.city);
        setState(result.data.state);
        setCountry(result.data.country || 'India');
        setPincodeSuccess(true);
        toast.success(`Address found: ${result.data.city}, ${result.data.state}`);
      } else {
        setPincodeError(result.error || 'Invalid pincode');
        toast.error('Could not validate pincode');
      }
    } catch (err) {
      setPincodeError('Failed to validate pincode');
    } finally {
      setPincodeValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-brand-dark-brown mb-8 flex items-center gap-4">
          Checkout
          <span className="text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100">
            {totalItems} Items
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content: Address and Payment */}
          <div className="w-full lg:w-2/3 space-y-6">
            <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-brand-dark-brown text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-bold text-brand-dark-brown">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
                  <input value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="123 Luxury Ave" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">City</label>
                  <input 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                    placeholder="New Delhi" 
                    className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all ${city ? 'text-brand-dark-brown' : ''}`}
                    readOnly={pincodeSuccess}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">State / Province</label>
                  <input 
                    value={state} 
                    onChange={(e) => setState(e.target.value)} 
                    required 
                    placeholder="Delhi" 
                    className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all ${state ? 'text-brand-dark-brown' : ''}`}
                    readOnly={pincodeSuccess}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Postal Code</label>
                  <div className="relative">
                    <input 
                      value={postalCode} 
                      onChange={handlePincodeChange} 
                      required 
                      maxLength={6}
                      placeholder="110001" 
                      className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all pr-12 ${
                        pincodeError ? 'border-red-300' : pincodeSuccess ? 'border-green-300' : 'border-gray-100'
                      }`} 
                    />
                    <button
                      type="button"
                      onClick={validatePincodeManually}
                      disabled={pincodeValidating || postalCode.length !== 6}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-gold hover:text-brand-dark-brown disabled:opacity-50 transition-colors"
                    >
                      {pincodeValidating ? (
                        <div className="animate-spin h-5 w-5 border-b-2 border-current rounded-full" />
                      ) : pincodeSuccess ? (
                        <HiCheckCircle className="w-5 h-5 text-green-500" />
                      ) : pincodeError ? (
                        <HiXCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <HiSearch className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {pincodeError && (
                    <p className="text-xs text-red-500 mt-1">{pincodeError}</p>
                  )}
                  {pincodeSuccess && (
                    <p className="text-xs text-green-600 mt-1">Pincode validated successfully</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Country</label>
                  <input value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all" />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-brand-dark-brown text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-bold text-brand-dark-brown">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-4 border-2 rounded-2xl px-6 py-5 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-brand-gold' : 'border-gray-300'}`}>
                    {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />}
                  </div>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                  <div>
                    <span className="block text-sm font-bold text-brand-dark-brown">Cash on Delivery</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Pay when you receive</span>
                  </div>
                </label>

                <label className={`flex items-center gap-4 border-2 rounded-2xl px-6 py-5 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-brand-gold' : 'border-gray-300'}`}>
                    {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />}
                  </div>
                  <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="hidden" />
                  <div>
                    <span className="block text-sm font-bold text-brand-dark-brown">Online Payment</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Stripe Secure Checkout</span>
                  </div>
                </label>
              </div>
            </section>

            <div className="p-4 bg-brand-gold/10 rounded-2xl flex items-start gap-3">
              <div className="text-brand-gold mt-1">ℹ</div>
              <p className="text-xs text-brand-dark-brown leading-relaxed">
                By clicking "Place Order", you agree to Markrin's <Link to="/terms" className="font-bold underline">Terms of Service</Link> and <Link to="/privacy" className="font-bold underline">Privacy Policy</Link>. All transactions are secure and encrypted.
              </p>
            </div>
          </div>

          {/* Right Sidebar: Order Summary */}
          <aside className="w-full lg:w-1/3 sticky top-24">
            <div className="bg-brand-dark-brown rounded-3xl p-8 text-white shadow-xl shadow-brand-dark-brown/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -translate-y-16 translate-x-16 blur-3xl pointer-events-none"></div>

              <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-brand-gold">Order Summary</h2>

              <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-6 mb-8 custom-scrollbar">
                {cart.items?.map((item) => (
                  <div key={item._id} className="flex gap-4 items-start">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'}
                        alt={item.product?.name}
                        className="w-16 h-20 object-cover rounded-xl border border-white/10"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold truncate pr-4">{item.product?.name}</h3>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-white/40 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <select
                          value={item.size}
                          onChange={(e) => updateSize(item._id, e.target.value)}
                          className="bg-white/10 border-none rounded-lg px-2 py-1 text-[10px] uppercase font-bold focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer"
                        >
                          {item.product?.sizes?.map(s => (
                            <option key={s} value={s} className="text-brand-dark-brown">{s}</option>
                          ))}
                        </select>

                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1 text-[10px] font-bold">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="hover:text-brand-gold">−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="hover:text-brand-gold">+</button>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-right pt-1 flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Shipping</span>
                  <span className="font-bold text-brand-gold">FREE</span>
                </div>
                <div className="flex justify-between text-lg pt-4 border-t border-white/5 mt-4">
                  <span className="font-bold uppercase tracking-widest text-xs">Total Pay</span>
                  <span className="font-bold text-2xl text-brand-gold">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={submitting || !cart.items?.length}
                className="w-full mt-10 py-5 bg-brand-gold text-brand-dark-brown font-bold uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/20"
              >
                {submitting ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Proceed to Payment' : 'Place Order'}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {activeOrder && (
        <StripePayment
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onSuccess={() => {
            setActiveOrder(null);
            refreshCart();
            toast.success('Payment successful');
            navigate(`/order-confirmation/${activeOrder._id}`);
          }}
        />
      )}
    </div>
  );
}

export default Checkout;
