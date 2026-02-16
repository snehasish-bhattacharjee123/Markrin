import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";
import {
    HiOutlineShoppingBag,
    HiOutlineTrash,
    HiOutlineHeart,
    HiOutlineTag,
    HiOutlineGift,
    HiChevronRight,
    HiChevronDown,
    HiPlus,
    HiMinus,
    HiCheckCircle,
} from "react-icons/hi2";
import {
    RiShoppingBag3Line,
    RiMapPinLine,
    RiSecurePaymentLine,
    RiEditLine,
} from "react-icons/ri";

// Checkout step indicator
const STEPS = [
    { id: 1, label: "MY BAG", icon: RiShoppingBag3Line },
    { id: 2, label: "ADDRESS", icon: RiMapPinLine },
    { id: 3, label: "PAYMENT", icon: RiSecurePaymentLine },
];

function CartPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const {
        cart,
        loading,
        totalItems,
        subtotal,
        updateItem,
        removeItem,
    } = useCart();
    const { toggleWishlist } = useWishlist();

    // Selection state
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [couponOpen, setCouponOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");

    // Initialize selection when cart loads
    React.useEffect(() => {
        if (cart.items?.length > 0) {
            setSelectedItems(new Set(cart.items.map((item) => item._id)));
        }
    }, [cart.items]);

    // Derived values
    const allSelected =
        cart.items?.length > 0 && selectedItems.size === cart.items.length;
    const selectedCount = selectedItems.size;

    const selectedSubtotal = useMemo(() => {
        return (
            cart.items
                ?.filter((item) => selectedItems.has(item._id))
                .reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
        );
    }, [cart.items, selectedItems]);

    // Tax calculations (approximate GST)
    const gstRate = 0.05;
    const cartTotalExclTax = selectedSubtotal / (1 + gstRate);
    const gstAmount = selectedSubtotal - cartTotalExclTax;
    const shippingCost = 0;
    const grandTotal = selectedSubtotal + shippingCost;

    // Handlers
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cart.items.map((item) => item._id)));
        }
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }
            return next;
        });
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        await updateItem(itemId, { quantity });
    };

    const updateSize = async (itemId, size) => {
        await updateItem(itemId, { size });
    };

    const handleRemove = async (itemId) => {
        await removeItem(itemId);
        setSelectedItems((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
        });
    };

    const handleMoveToWishlist = async (item) => {
        try {
            await toggleWishlist(item.product?._id);
            await removeItem(item._id);
            setSelectedItems((prev) => {
                const next = new Set(prev);
                next.delete(item._id);
                return next;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;
        toast.info("Coupon feature coming soon!");
        setCouponCode("");
    };

    const handlePlaceOrder = () => {
        if (selectedCount === 0) {
            toast.error("Please select at least one item");
            return;
        }
        navigate("/checkout");
    };

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-brand-cream flex items-center justify-center font-inter">
                <div className="text-center">
                    <HiOutlineShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-brand-dark-brown mb-3">
                        Your Shopping Bag
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Please login to view your cart
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-sm rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300"
                    >
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-brand-cream flex items-center justify-center font-inter">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-gold" />
            </div>
        );
    }

    // Empty cart
    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-brand-cream font-inter">
                {/* Progress Steps */}
                <ProgressSteps currentStep={1} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-28 h-28 bg-brand-gold/10 rounded-full flex items-center justify-center mb-8">
                            <HiOutlineShoppingBag className="w-14 h-14 text-brand-gold" />
                        </div>
                        <h2 className="text-3xl font-bold text-brand-dark-brown mb-3">
                            Your bag is empty
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md">
                            Looks like you haven't added anything to your bag yet.
                            Browse our collections and find something you love.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block px-10 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-sm rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 shadow-lg shadow-brand-dark-brown/10"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream font-inter">
            {/* Progress Steps */}
            <ProgressSteps currentStep={1} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* ========== LEFT SECTION ========== */}
                    <div className="w-full lg:w-[65%] space-y-6">
                        {/* Delivery Address Block */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center">
                                        <RiMapPinLine className="w-5 h-5 text-brand-gold" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-bold">
                                            Deliver To
                                        </p>
                                        {user?.address?.street ? (
                                            <p className="text-sm font-semibold text-brand-dark-brown">
                                                {user.name},{" "}
                                                <span className="text-brand-gold">
                                                    {user.address.postalCode}
                                                </span>
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                No address set
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-1.5 px-4 py-2 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.12em] rounded-lg hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300"
                                >
                                    <RiEditLine className="w-3.5 h-3.5" />
                                    Change
                                </Link>
                            </div>
                            {user?.address?.street && (
                                <p className="text-xs text-gray-400 mt-2 ml-[52px]">
                                    {user.address.street}, {user.address.city},{" "}
                                    {user.address.state}
                                </p>
                            )}
                        </div>

                        {/* Items Selection Header */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-5 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div
                                        onClick={toggleSelectAll}
                                        className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center cursor-pointer ${allSelected
                                                ? "border-brand-gold bg-brand-gold"
                                                : "border-gray-300 bg-white"
                                            }`}
                                    >
                                        {allSelected && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-dark-brown">
                                        {selectedCount}/{cart.items.length} Items Selected
                                    </span>
                                </label>
                                <span className="text-sm font-bold text-brand-dark-brown">
                                    ₹{selectedSubtotal.toFixed(0)}
                                </span>
                            </div>

                            {/* Cart Item Cards */}
                            <div className="divide-y divide-gray-50">
                                {cart.items.map((item) => (
                                    <CartItemCard
                                        key={item._id}
                                        item={item}
                                        isSelected={selectedItems.has(item._id)}
                                        onToggleSelect={() => toggleItemSelection(item._id)}
                                        onUpdateQuantity={updateQuantity}
                                        onUpdateSize={updateSize}
                                        onRemove={() => handleRemove(item._id)}
                                        onMoveToWishlist={() => handleMoveToWishlist(item)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ========== RIGHT SECTION – Order Summary ========== */}
                    <aside className="w-full lg:w-[35%] lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Place Order Button (Top) */}
                            <div className="p-5 sm:p-6 border-b border-gray-50">
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={selectedCount === 0}
                                    className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-dark-brown/10 transform hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    Place Order
                                </button>
                            </div>

                            {/* Coupon / Offers Accordion */}
                            <div className="border-b border-gray-50">
                                <button
                                    onClick={() => setCouponOpen(!couponOpen)}
                                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <HiOutlineTag className="w-5 h-5 text-brand-gold" />
                                        <span className="text-sm font-bold text-brand-dark-brown">
                                            Apply Coupon
                                        </span>
                                    </div>
                                    {couponOpen ? (
                                        <HiChevronDown className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <HiChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {couponOpen && (
                                    <div className="px-5 sm:px-6 pb-4">
                                        <form
                                            onSubmit={handleApplyCoupon}
                                            className="flex gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) =>
                                                    setCouponCode(e.target.value.toUpperCase())
                                                }
                                                placeholder="Enter coupon code"
                                                className="flex-grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                                            />
                                            <button
                                                type="submit"
                                                className="px-5 py-3 bg-brand-gold/10 text-brand-gold font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                                            >
                                                Apply
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* Gift Wrap (static accordion) */}
                            <div className="border-b border-gray-50">
                                <button
                                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-default opacity-60"
                                    disabled
                                >
                                    <div className="flex items-center gap-3">
                                        <HiOutlineGift className="w-5 h-5 text-brand-gold" />
                                        <span className="text-sm font-bold text-brand-dark-brown">
                                            Gift Wrap
                                        </span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                        Coming Soon
                                    </span>
                                </button>
                            </div>

                            {/* Billing Details */}
                            <div className="p-5 sm:p-6 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
                                    Billing Details
                                </h3>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Cart Total{" "}
                                        <span className="text-[10px] text-gray-400">
                                            (Excl. of taxes)
                                        </span>
                                    </span>
                                    <span className="font-semibold text-brand-dark-brown">
                                        ₹{cartTotalExclTax.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">GST</span>
                                    <span className="font-semibold text-brand-dark-brown">
                                        ₹{gstAmount.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping Charges</span>
                                    <span className="font-bold text-brand-green-accent">
                                        FREE
                                    </span>
                                </div>

                                <div className="h-px bg-gray-100 my-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-[0.1em] text-brand-dark-brown">
                                        Total Amount
                                    </span>
                                    <span className="text-xl font-bold text-brand-dark-brown">
                                        ₹{grandTotal.toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Place Order (mobile sticky feel) */}
                            <div className="p-5 sm:p-6 pt-0">
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={selectedCount === 0}
                                    className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-dark-brown/10 lg:hidden"
                                >
                                    Place Order — ₹{grandTotal.toFixed(0)}
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex items-center justify-center gap-6 py-4">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <HiCheckCircle className="w-4 h-4 text-brand-green-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    Secure
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <HiCheckCircle className="w-4 h-4 text-brand-green-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    Free Shipping
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <HiCheckCircle className="w-4 h-4 text-brand-green-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    Easy Returns
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// SUB-COMPONENTS
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
                                        ? "bg-brand-dark-brown text-white shadow-md shadow-brand-dark-brown/20"
                                        : "bg-gray-100 text-gray-400"
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
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <step.icon className="w-4 h-4" />
                                    )}
                                </div>
                                <span
                                    className={`text-[11px] font-bold uppercase tracking-[0.15em] hidden sm:block ${step.id <= currentStep
                                        ? "text-brand-dark-brown"
                                        : "text-gray-400"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`w-12 sm:w-20 h-[2px] mx-3 sm:mx-5 rounded-full transition-all duration-300 ${step.id < currentStep ? "bg-brand-gold" : "bg-gray-200"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CartItemCard({
    item,
    isSelected,
    onToggleSelect,
    onUpdateQuantity,
    onUpdateSize,
    onRemove,
    onMoveToWishlist,
}) {
    const product = item.product;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return (
        <div
            className={`px-5 sm:px-6 py-5 transition-all duration-200 ${isSelected ? "bg-white" : "bg-gray-50/50"
                }`}
        >
            <div className="flex gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                    <div
                        onClick={onToggleSelect}
                        className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center cursor-pointer ${isSelected
                                ? "border-brand-gold bg-brand-gold"
                                : "border-gray-300 bg-white"
                            }`}
                    >
                        {isSelected && (
                            <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Product Image */}
                <Link
                    to={`/product/${product?.slug || product?._id}`}
                    className="flex-shrink-0"
                >
                    <img
                        src={
                            product?.images?.[0]?.url ||
                            "https://via.placeholder.com/120"
                        }
                        alt={product?.name || "Product"}
                        className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity"
                    />
                </Link>

                {/* Product Details */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <Link
                                to={`/product/${product?.slug || product?._id}`}
                            >
                                <h3 className="text-sm font-bold text-brand-dark-brown leading-snug hover:text-brand-gold transition-colors line-clamp-2">
                                    {product?.name || "Product"}
                                </h3>
                            </Link>
                            {product?.category && (
                                <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider">
                                    {product.category}
                                </p>
                            )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <p className="text-base font-bold text-brand-dark-brown">
                                ₹{(item.price * item.quantity).toFixed(0)}
                            </p>
                            {item.quantity > 1 && (
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                    ₹{item.price?.toFixed(0)} each
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Size & Qty Controls */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Size Dropdown */}
                        {product?.sizes?.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Size:
                                </span>
                                <select
                                    value={item.size || ""}
                                    onChange={(e) => onUpdateSize(item._id, e.target.value)}
                                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold cursor-pointer appearance-none pr-7"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234E3B31' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 8px center",
                                    }}
                                >
                                    {product.sizes.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Qty:
                            </span>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() =>
                                        onUpdateQuantity(item._id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                    className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-30"
                                >
                                    <HiMinus className="w-3.5 h-3.5 text-brand-dark-brown" />
                                </button>
                                <span className="px-3 text-sm font-bold text-brand-dark-brown min-w-[28px] text-center">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        onUpdateQuantity(item._id, item.quantity + 1)
                                    }
                                    className="p-1.5 hover:bg-gray-100 transition-colors"
                                >
                                    <HiPlus className="w-3.5 h-3.5 text-brand-dark-brown" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Estimated Delivery */}
                    <p className="text-[11px] text-gray-400 mt-3">
                        <span className="text-brand-green-accent font-semibold">
                            Estimated Delivery:
                        </span>{" "}
                        {estimatedDelivery.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 mt-3 -ml-1">
                        <button
                            onClick={onRemove}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 hover:text-brand-maroon-accent hover:bg-red-50 rounded-lg transition-all"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                            Remove
                        </button>
                        <div className="w-px h-4 bg-gray-200" />
                        <button
                            onClick={onMoveToWishlist}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 hover:text-brand-gold hover:bg-brand-gold/5 rounded-lg transition-all"
                        >
                            <HiOutlineHeart className="w-4 h-4" />
                            Move to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
