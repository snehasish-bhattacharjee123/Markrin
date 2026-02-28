import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../../api';
import { toast } from 'sonner';
import { HiXMark } from 'react-icons/hi2';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const RazorpayPayment = ({ order, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializePayment = async () => {
            if (!order) return;

            try {
                // 1. Load Razorpay script
                const resScript = await loadRazorpayScript();
                if (!resScript) {
                    throw new Error("Razorpay SDK failed to load. Are you online?");
                }

                // 2. Fetch Razorpay key
                const configRes = await fetch('/api/payment/config');
                const configData = await configRes.json();

                if (!configData.key) {
                    throw new Error("Razorpay key not found");
                }

                // 3. Create Razorpay order from backend
                const res = await fetch('/api/payment/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ orderId: order._id }),
                });

                if (!res.ok) {
                    throw new Error("Failed to create Razorpay order on backend.");
                }
                const data = await res.json();

                // 4. Initialize Razorpay Checkout
                const options = {
                    key: configData.key,
                    amount: data.amount,
                    currency: data.currency,
                    name: "Markrin",
                    description: "Order #" + order._id,
                    order_id: data.id,
                    handler: async (response) => {
                        try {
                            setIsLoading(true);
                            await ordersAPI.updateToPaid(order._id, {
                                id: response.razorpay_payment_id,
                                status: response.razorpay_order_id,
                                update_time: new Date().toISOString(),
                                email_address: order.user?.email || "customer@example.com",
                            });
                            onSuccess();
                        } catch (err) {
                            console.error(err);
                            toast.error("Payment verification failed. Please contact support.");
                            onClose();
                        }
                    },
                    prefill: {
                        name: order.shippingAddress.name || "",
                        contact: order.shippingAddress.phone || "",
                        email: order.user?.email || "",
                    },
                    theme: {
                        color: "#C9A76E",
                    },
                    modal: {
                        ondismiss: function () {
                            toast.info("Payment cancelled");
                            onClose();
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    toast.error("Payment failed: " + response.error.description);
                    onClose();
                });

                // Clear loading and open immediately
                setIsLoading(false);
                rzp.open();

            } catch (err) {
                console.error("Razorpay Error:", err);
                toast.error(err.message || 'Failed to initialize payment');
                onClose();
            }
        };

        initializePayment();
    }, [order, onClose, onSuccess]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <HiXMark className="w-5 h-5" />
                </button>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-10 h-10 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mb-4" />
                        <h3 className="text-sm font-bold text-brand-dark-brown">Initializing Gateway...</h3>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                        <h3 className="text-lg font-bold text-brand-dark-brown mb-2">Complete Payment</h3>
                        <p className="text-sm text-gray-500 mb-6">A secure Razorpay window should have opened. Please switch to it to complete your purchase.</p>
                        <button onClick={() => onClose()} className="border border-gray-200 px-4 py-2 rounded text-sm text-gray-500 hover:bg-gray-50">Cancel Payment</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RazorpayPayment;
