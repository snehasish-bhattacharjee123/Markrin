import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import RazorpayPayment from '../components/Checkout/RazorpayPayment';
import {
  HiCheckCircle,
  HiXCircle,
  HiMagnifyingGlass,
  HiPlus,
} from 'react-icons/hi2';
import {
  RiShoppingBag3Line,
  RiMapPinLine,
  RiSecurePaymentLine,
  RiEditLine,
  RiDeleteBinLine,
  RiHome4Line,
  RiBriefcaseLine,
  RiBankCard2Line,
} from 'react-icons/ri';
import { validatePincode, getAddressFromPincode } from '../utils/pincodeService';

// Checkout step definitions
const STEPS = [
  { id: 1, label: 'MY BAG', icon: RiShoppingBag3Line },
  { id: 2, label: 'ADDRESS', icon: RiMapPinLine },
  { id: 3, label: 'PAYMENT', icon: RiSecurePaymentLine },
];

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, subtotal, totalItems, refreshCart } = useCart();

  // Step management: 'address' or 'payment'
  const [currentStep, setCurrentStep] = useState('address');

  // Address state
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Pincode validation
  const [pincodeValidating, setPincodeValidating] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [pincodeSuccess, setPincodeSuccess] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Tax calculations
  const gstRate = 0.05;
  const cartTotalExclTax = subtotal / (1 + gstRate);
  const gstAmount = subtotal - cartTotalExclTax;
  const shippingCost = 0;
  const grandTotal = subtotal + shippingCost;

  // Initialize addresses from user profile
  useEffect(() => {
    if (user) {
      const userAddresses = [];
      if (user.address && user.address.street) {
        userAddresses.push({
          label: 'Home',
          name: user.name || '',
          phone: user.phone || '',
          street: user.address.street,
          city: user.address.city,
          state: user.address.state,
          postalCode: user.address.postalCode,
          country: user.address.country || 'India',
        });
      }
      setAddresses(userAddresses);
      if (userAddresses.length > 0) {
        setSelectedAddressIndex(0);
      }
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Pincode handler
  const handlePincodeChange = async (value) => {
    setFormData((prev) => ({ ...prev, postalCode: value }));
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
          setFormData((prev) => ({
            ...prev,
            city: result.data.city,
            state: result.data.state,
            country: result.data.country || 'India',
          }));
          setPincodeSuccess(true);
        } else {
          setPincodeError(result.error || 'Invalid pincode');
        }
      } catch {
        setPincodeError('Failed to validate pincode');
      } finally {
        setPincodeValidating(false);
      }
    }
  };

  // Save address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingIndex !== null) {
      setAddresses((prev) => {
        const updated = [...prev];
        updated[editingIndex] = { ...formData };
        return updated;
      });
      setSelectedAddressIndex(editingIndex);
      setEditingIndex(null);
      toast.success('Address updated');
    } else {
      setAddresses((prev) => [...prev, { ...formData }]);
      setSelectedAddressIndex(addresses.length);
      toast.success('Address added');
    }

    setShowAddressForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      label: 'Home',
      name: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    });
    setPincodeError('');
    setPincodeSuccess(false);
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setFormData({ ...addresses[index] });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(0);
    } else if (selectedAddressIndex > index) {
      setSelectedAddressIndex((prev) => prev - 1);
    }
    toast.success('Address deleted');
  };

  // Continue to payment step
  const handleContinueToPayment = () => {
    if (addresses.length === 0) {
      toast.error('Please add a delivery address');
      return;
    }
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Place order
  const placeOrder = async () => {
    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const selected = addresses[selectedAddressIndex];
    if (!selected) {
      toast.error('Please select a delivery address');
      return;
    }

    setSubmitting(true);
    try {
      const order = await ordersAPI.create(
        {
          street: selected.street,
          city: selected.city,
          state: selected.state,
          postalCode: selected.postalCode,
          country: selected.country,
        },
        paymentMethod
      );

      if (paymentMethod === 'ONLINE') {
        setActiveOrder(order);
        setSubmitting(false);
        return;
      }

      await refreshCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAddress = addresses[selectedAddressIndex];

  return (
    <div className="min-h-screen bg-brand-cream font-inter">
      {/* Progress Steps */}
      <ProgressSteps currentStep={currentStep === 'address' ? 2 : 3} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ========== LEFT SECTION ========== */}
          <div className="w-full lg:w-[65%] space-y-6">

            {/* ===== STEP 2: ADDRESS ===== */}
            {currentStep === 'address' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-brand-dark-brown">
                    Delivery To
                  </h2>
                  <button
                    onClick={() => navigate('/cart')}
                    className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-dark-brown transition-colors"
                  >
                    ← Back to Bag
                  </button>
                </div>

                {/* Add New Address Button */}
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      resetForm();
                      setShowAddressForm(true);
                    }}
                    className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-5 flex items-center gap-3 text-brand-gold font-bold text-sm hover:bg-brand-gold/5 transition-all"
                  >
                    <HiPlus className="w-5 h-5" />
                    Add New Address
                  </button>
                )}

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-brand-dark-brown uppercase tracking-wider">
                        {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingIndex(null);
                          resetForm();
                        }}
                        className="text-xs text-gray-400 hover:text-brand-dark-brown transition-colors font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleSaveAddress} className="space-y-5">
                      {/* Address Label */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                          Address Type
                        </label>
                        <div className="flex gap-3">
                          {['Home', 'Work', 'Other'].map((label) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, label }))}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all ${formData.label === label
                                ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                                : 'border-gray-100 text-gray-400'
                                }`}
                            >
                              {label === 'Home' && <RiHome4Line className="w-4 h-4" />}
                              {label === 'Work' && <RiBriefcaseLine className="w-4 h-4" />}
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            required
                            placeholder="Snehasish Bhattacharjee"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="8545424542"
                            maxLength={10}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Postal Code (first for auto-fill) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                            Pincode *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.postalCode}
                              onChange={(e) => handlePincodeChange(e.target.value)}
                              required
                              maxLength={6}
                              placeholder="700023"
                              className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all pr-12 ${pincodeError ? 'border-red-300' : pincodeSuccess ? 'border-green-300' : 'border-gray-100'
                                }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {pincodeValidating ? (
                                <div className="animate-spin h-5 w-5 border-b-2 border-brand-gold rounded-full" />
                              ) : pincodeSuccess ? (
                                <HiCheckCircle className="w-5 h-5 text-green-500" />
                              ) : pincodeError ? (
                                <HiXCircle className="w-5 h-5 text-red-500" />
                              ) : (
                                <HiMagnifyingGlass className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                          </div>
                          {pincodeError && <p className="text-xs text-red-500 mt-1">{pincodeError}</p>}
                          {pincodeSuccess && <p className="text-xs text-green-600 mt-1">Pincode validated ✓</p>}
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                            required
                            placeholder="Kolkata"
                            readOnly={pincodeSuccess}
                            className={`w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all ${pincodeSuccess ? 'text-brand-dark-brown bg-green-50/30' : ''
                              }`}
                          />
                        </div>
                      </div>

                      {/* Street */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData((p) => ({ ...p, street: e.target.value }))}
                          required
                          placeholder="House/Flat No., Building, Street, Area"
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all"
                        />
                      </div>

                      {/* State & Country */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                            required
                            placeholder="West Bengal"
                            readOnly={pincodeSuccess}
                            className={`w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all ${pincodeSuccess ? 'text-brand-dark-brown bg-green-50/30' : ''
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 shadow-lg shadow-brand-dark-brown/10"
                      >
                        {editingIndex !== null ? 'Update Address' : 'Save Address'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Saved Addresses */}
                <div className="space-y-4">
                  {addresses.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedAddressIndex(index)}
                      className={`bg-white rounded-2xl border-2 p-5 sm:p-6 cursor-pointer transition-all ${selectedAddressIndex === index
                        ? 'border-brand-gold shadow-md shadow-brand-gold/10'
                        : 'border-gray-100'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Radio circle */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedAddressIndex === index
                              ? 'border-brand-gold'
                              : 'border-gray-300'
                              }`}
                          >
                            {selectedAddressIndex === index && (
                              <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />
                            )}
                          </div>
                        </div>

                        {/* Address content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-sm text-brand-dark-brown">
                              {addr.name}
                            </span>
                            <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-wider rounded">
                              {addr.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {addr.street}
                            <br />
                            {addr.city} - {addr.postalCode}
                            <br />
                            {addr.state},
                            {addr.phone && (
                              <>
                                <br />
                                Mobile: {addr.phone}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edit / Delete buttons */}
                      <div className="flex items-center justify-center gap-8 mt-5 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(index);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-brand-gold transition-colors"
                        >
                          <RiEditLine className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(index);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <RiDeleteBinLine className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ===== STEP 3: PAYMENT ===== */}
            {currentStep === 'payment' && (
              <>
                {/* Delivery summary bar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-brand-dark-brown">
                        Deliver To: {selectedAddress?.name},{' '}
                        <span className="text-brand-gold">{selectedAddress?.postalCode}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {selectedAddress?.street}, {selectedAddress?.city}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep('address')}
                      className="flex-shrink-0 px-4 py-2 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.12em] rounded-lg hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="px-5 sm:px-6 py-4 border-b border-gray-50">
                    <h3 className="text-sm font-bold text-brand-dark-brown uppercase tracking-wider">
                      Payment Options
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {/* COD */}
                    <label
                      className={`flex items-center gap-4 px-5 sm:px-6 py-5 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'bg-brand-gold/5' : 'hover:bg-gray-50/50'
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'COD' ? 'border-brand-gold' : 'border-gray-300'
                          }`}
                      >
                        {paymentMethod === 'COD' && (
                          <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="hidden"
                      />
                      <div className="flex-grow">
                        <span className="block text-sm font-bold text-brand-dark-brown">
                          Cash on Delivery
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Pay when you receive your order
                        </span>
                      </div>
                    </label>

                    {/* Online Payment */}
                    <label
                      className={`flex items-center gap-4 px-5 sm:px-6 py-5 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'bg-brand-gold/5' : 'hover:bg-gray-50/50'
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'ONLINE' ? 'border-brand-gold' : 'border-gray-300'
                          }`}
                      >
                        {paymentMethod === 'ONLINE' && (
                          <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value="ONLINE"
                        checked={paymentMethod === 'ONLINE'}
                        onChange={() => setPaymentMethod('ONLINE')}
                        className="hidden"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="block text-sm font-bold text-brand-dark-brown">
                            Credit & Debit Cards
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          Razorpay Secure Checkout — UPI, Cards, Netbanking
                        </span>
                      </div>
                      <RiBankCard2Line className="w-6 h-6 text-gray-300 flex-shrink-0" />
                    </label>
                  </div>
                </div>

                {/* Terms notice */}
                <div className="p-4 bg-brand-gold/10 rounded-2xl flex items-start gap-3">
                  <div className="text-brand-gold mt-0.5 text-sm">ℹ</div>
                  <p className="text-xs text-brand-dark-brown leading-relaxed">
                    By clicking "Confirm Order", you agree to Markrin's{' '}
                    <Link to="/terms" className="font-bold underline">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="font-bold underline">Privacy Policy</Link>.
                    All transactions are secure and encrypted.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* ========== RIGHT SECTION – Billing Summary ========== */}
          <aside className="w-full lg:w-[35%] lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Action Button (Top) */}
              <div className="p-5 sm:p-6 border-b border-gray-50">
                {currentStep === 'address' ? (
                  <button
                    onClick={handleContinueToPayment}
                    disabled={addresses.length === 0}
                    className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-dark-brown/10 transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Continue to Payment
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={submitting || !cart.items?.length}
                    className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-dark-brown/10 transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {submitting
                      ? 'Processing...'
                      : paymentMethod === 'ONLINE'
                        ? 'Proceed to Payment'
                        : 'Confirm Order'}
                  </button>
                )}
              </div>

              {/* Billing Details */}
              <div className="p-5 sm:p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
                  Billing Details
                </h3>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Cart Total{' '}
                    <span className="text-[10px] text-gray-400">(Excl. of all taxes)</span>
                  </span>
                  <span className="font-semibold text-brand-dark-brown">
                    ₹ {cartTotalExclTax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST</span>
                  <span className="font-semibold text-brand-dark-brown">
                    ₹ {gstAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Charges</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-green-accent">Free</span>
                    <span className="text-xs text-gray-400 line-through">₹50.00</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-dark-brown">Total Amount</span>
                  <span className="text-xl font-bold text-brand-dark-brown">
                    ₹ {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Bottom button for mobile */}
              <div className="p-5 sm:p-6 pt-0 lg:hidden">
                {currentStep === 'address' ? (
                  <button
                    onClick={handleContinueToPayment}
                    disabled={addresses.length === 0}
                    className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue to Payment — ₹{grandTotal.toFixed(0)}
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={submitting || !cart.items?.length}
                    className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : 'Confirm Order — ₹' + grandTotal.toFixed(0)}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {activeOrder && (
        <RazorpayPayment
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

// ============================================================
// PROGRESS STEPS (shared component)
// ============================================================
function ProgressSteps({ currentStep }) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-center">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${step.id <= currentStep
                    ? 'bg-brand-dark-brown text-white shadow-md shadow-brand-dark-brown/20'
                    : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  {step.id < currentStep ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.15em] hidden sm:block ${step.id <= currentStep ? 'text-brand-dark-brown' : 'text-gray-400'
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-[2px] mx-3 sm:mx-5 rounded-full transition-all duration-500 ${step.id < currentStep
                    ? 'bg-brand-gold'
                    : 'bg-gray-200 bg-[length:10px_2px] bg-repeat-x'
                    }`}
                  style={
                    step.id >= currentStep
                      ? {
                        backgroundImage:
                          'linear-gradient(to right, #d1d5db 5px, transparent 5px)',
                        backgroundSize: '10px 2px',
                        backgroundColor: 'transparent',
                      }
                      : {}
                  }
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
