import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../api';
import { RiCheckboxCircleFill, RiTruckLine, RiMapPinLine, RiCalendarCheckLine } from 'react-icons/ri';

function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await ordersAPI.getById(id);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-brand-dark-brown mb-4">Order Not Found</h2>
                <Link to="/shop" className="px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider rounded-lg">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream py-16">
            <div className="max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-center p-8 md:p-12">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <RiCheckboxCircleFill size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-dark-brown mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for your purchase. Your order <span className="font-bold text-brand-dark-brown">#{order._id.slice(-8).toUpperCase()}</span> has been placed successfully.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
                        <div className="bg-gray-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-3 text-brand-gold mb-3">
                                <RiTruckLine size={20} />
                                <h3 className="font-bold text-brand-dark-brown uppercase text-xs tracking-widest">Shipping Detail</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {order.shippingAddress.street},<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state},<br />
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-3 text-brand-gold mb-3">
                                <RiCalendarCheckLine size={20} />
                                <h3 className="font-bold text-brand-dark-brown uppercase text-xs tracking-widest">Expected Delivery</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 mb-8 text-left">
                        <h3 className="font-bold text-brand-dark-brown mb-4 uppercase text-xs tracking-widest">Order Summary</h3>
                        <div className="space-y-4">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                    <div className="flex-grow">
                                        <p className="text-sm font-semibold text-brand-dark-brown">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}</p>
                                    </div>
                                    <div className="text-sm font-bold text-brand-dark-brown">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 flex justify-between items-center text-lg">
                                <span className="font-bold text-brand-dark-brown">Total Paid</span>
                                <span className="font-bold text-brand-gold">${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/orders"
                            className="px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-dark-brown transition-all rounded-xl"
                        >
                            View My Orders
                        </Link>
                        <Link
                            to="/shop"
                            className="px-8 py-4 border border-brand-dark-brown text-brand-dark-brown font-bold uppercase tracking-widest text-xs hover:bg-brand-dark-brown hover:text-white transition-all rounded-xl"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
