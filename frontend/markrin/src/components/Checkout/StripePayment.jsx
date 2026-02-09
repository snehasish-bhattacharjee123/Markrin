import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentAPI, ordersAPI } from '../../api';
import { toast } from 'sonner';

const CheckoutForm = ({ orderId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
                return_url: `${window.location.origin}/profile`, // or order success page
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            toast.error(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Update order status on backend
            // Ideally webhook handles this, but frontend update is good for immediate feedback
            try {
                await ordersAPI.pay(orderId, {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    update_time: new Date().toISOString(),
                    email_address: paymentIntent.receipt_email,
                });
                onSuccess();
            } catch (err) {
                toast.error("Payment successful but failed to update order status: " + err.message);
            }
            setIsLoading(false);
        } else {
            setMessage("Unexpected state");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="payment-form">
            <PaymentElement id="payment-element" />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full mt-4 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all disabled:opacity-60 rounded-xl"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </div>
                ) : (
                    "Pay Now"
                )}
            </button>
            {message && <div id="payment-message" className="mt-4 text-red-500 text-sm text-center">{message}</div>}
        </form>
    );
};

const StripePayment = ({ order, onClose, onSuccess }) => {
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        const init = async () => {
            // 1. Get Config
            try {
                const config = await paymentAPI.getConfig();
                if (config.publishableKey) {
                    setStripePromise(loadStripe(config.publishableKey));
                } else {
                    toast.error("Stripe key not found");
                    return;
                }

                // 2. Create Payment Intent
                const data = await paymentAPI.createPaymentIntent(order._id);
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error(err);
                toast.error("Failed to initialize payment");
                onClose(); // Close if failed
            }
        };

        if (order) {
            init();
        }
    }, [order]);

    if (!stripePromise || !clientSecret) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-brand-dark-brown font-semibold">Initializing Secure Payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark-brown">Secure Payment</h2>
                    <p className="text-gray-500 text-sm mt-1">Total to pay: <span className="font-bold text-brand-dark-brown">${order.totalPrice?.toFixed(2)}</span></p>
                </div>

                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <CheckoutForm orderId={order._id} onSuccess={onSuccess} />
                </Elements>

                <div className="mt-6 flex justify-center items-center gap-2 text-xs text-gray-400">
                    <span className="bg-gray-100 px-2 py-1 rounded">Powered by Stripe</span>
                    <span>SSL Encrypted</span>
                </div>
            </div>
        </div>
    );
};

export default StripePayment;
