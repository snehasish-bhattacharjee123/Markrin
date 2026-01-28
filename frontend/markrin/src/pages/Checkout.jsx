import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

function Checkout() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
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

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  const faqItems = useMemo(
    () => [
      {
        q: 'How do I place an order?',
        a: 'Review your bag, fill your address, choose a payment method, and click Proceed to Pay.',
      },
      {
        q: 'Can I edit my profile during checkout?',
        a: 'Yes. Use the profile section on the left to update your name, email, or password.',
      },
      {
        q: 'What payment methods are available?',
        a: 'Cash on Delivery and Online Payment. Online payment is currently a mock flow that marks the order as paid.',
      },
      {
        q: 'What if my bag is empty?',
        a: 'You will need to add products to your cart before placing an order.',
      },
    ],
    []
  );

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const order = await ordersAPI.create(
        { street, city, state, postalCode, country },
        paymentMethod
      );

      if (paymentMethod === 'ONLINE') {
        await ordersAPI.pay(order._id, {
          id: `mock_${Date.now()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: 'mock@markrin.local',
        });
      }

      await refreshCart();
      toast.success(paymentMethod === 'ONLINE' ? 'Payment successful' : 'Order placed successfully');
      navigate('/profile');
      return order;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!profileName.trim() || !profileEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setProfileSubmitting(true);
    try {
      const payload = {
        name: profileName.trim(),
        email: profileEmail.trim(),
      };
      if (profilePassword.trim()) {
        payload.password = profilePassword;
      }

      const res = await updateProfile(payload);
      if (!res.success) {
        toast.error(res.error || 'Failed to update profile');
        return;
      }
      setProfilePassword('');
      toast.success('Profile updated');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await updateItem(itemId, quantity);
  };

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          <aside className="w-full lg:w-1/3">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-brand-dark-brown mb-4">Edit Profile</h2>
                <form onSubmit={saveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name</label>
                    <input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">New Password</label>
                    <input
                      type="password"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="w-full py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-dark-brown transition-all disabled:opacity-60"
                  >
                    {profileSubmitting ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-brand-dark-brown mb-4">FAQ</h2>
                <div className="space-y-3">
                  {faqItems.map((item, idx) => {
                    const open = openFaqIndex === idx;
                    return (
                      <div key={item.q} className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(open ? -1 : idx)}
                          className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
                        >
                          <span className="text-sm font-semibold text-brand-dark-brown">{item.q}</span>
                          <span className="text-gray-400 text-sm">{open ? '−' : '+'}</span>
                        </button>
                        {open && (
                          <div className="px-4 pb-4 text-sm text-gray-600">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          <main className="w-full lg:w-2/3">
            <h1 className="text-3xl font-bold text-brand-dark-brown mb-8">Checkout</h1>

            <form onSubmit={placeOrder} className="space-y-6">
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between gap-6 mb-4">
                  <h2 className="text-lg font-bold text-brand-dark-brown">1. My Bag</h2>
                  <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-brand-dark-brown transition-colors">
                    Continue Shopping
                  </Link>
                </div>

                {(!cart.items || cart.items.length === 0) ? (
                  <div className="text-sm text-gray-500">
                    Your bag is empty. Add some items to proceed.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'}
                          alt={item.product?.name || 'Product'}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-brand-dark-brown text-sm line-clamp-1">
                                {item.product?.name || 'Product'}
                              </h3>
                              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                {item.size ? <span>Size: {item.size}</span> : null}
                                {item.color ? <span>Color: {item.color}</span> : null}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item._id)}
                              className="text-xs font-bold uppercase tracking-widest text-brand-maroon-accent hover:text-brand-dark-brown transition-colors"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                              >
                                −
                              </button>
                              <span className="px-4 text-sm font-semibold text-brand-dark-brown">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-sm font-bold text-brand-dark-brown">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Items</span>
                        <span>{totalItems}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        Shipping and taxes calculated at checkout
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-brand-dark-brown mb-4">2. Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Street</label>
                    <input value={street} onChange={(e) => setStreet(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">City</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">State</label>
                    <input value={state} onChange={(e) => setState(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Postal Code</label>
                    <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Country</label>
                    <input value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none" />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-brand-dark-brown mb-4">3. Select Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer ${paymentMethod === 'COD' ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-200 bg-white'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <span className="text-sm font-semibold text-brand-dark-brown">Cash on Delivery</span>
                  </label>

                  <label className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-200 bg-white'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                    />
                    <span className="text-sm font-semibold text-brand-dark-brown">Online Payment</span>
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Online payment is currently a mock flow that marks the order as paid using the backend pay endpoint.
                </p>
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-brand-dark-brown mb-4">4. Proceed to Pay</h2>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between md:justify-start md:gap-6">
                      <span>Items</span>
                      <span className="font-semibold text-brand-dark-brown">{totalItems}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:gap-6 mt-1">
                      <span>Subtotal</span>
                      <span className="font-semibold text-brand-dark-brown">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all disabled:opacity-60"
                  >
                    {submitting ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Proceed to Pay' : 'Place Order'}
                  </button>
                </div>
              </section>
            </form>
          </main>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
