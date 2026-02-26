import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../api';
import { RiCheckboxCircleFill, RiTruckLine, RiMapPinLine, RiCalendarCheckLine, RiDownload2Line } from 'react-icons/ri';
import jsPDF from 'jspdf';

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

    const downloadReceipt = () => {
        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            pdf.setFont("helvetica");

            // Header
            pdf.setFontSize(24);
            pdf.setTextColor(78, 59, 49); // #4E3B31 (brand-dark-brown)
            pdf.text("MARKRIN", 40, 60);

            pdf.setFontSize(12);
            pdf.setTextColor(150, 150, 150);
            pdf.text("Order Receipt / Challan", 40, 80);

            pdf.setFontSize(10);
            pdf.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`, 400, 60);
            pdf.text(`Date: ${new Date().toLocaleDateString()}`, 400, 75);

            pdf.setDrawColor(200, 200, 200);
            pdf.line(40, 100, 550, 100);

            // Shipping Info
            pdf.setFontSize(12);
            pdf.setTextColor(78, 59, 49);
            pdf.text("Shipping Details:", 40, 130);

            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            const addr = order.shippingAddress;
            pdf.text(`${addr.street}`, 40, 150);
            pdf.text(`${addr.city}, ${addr.state}`, 40, 165);
            pdf.text(`${addr.postalCode}, ${addr.country}`, 40, 180);

            // Items Table Header
            pdf.line(40, 210, 550, 210);
            pdf.setFontSize(10);
            pdf.setTextColor(78, 59, 49);
            pdf.text("Item", 40, 230);
            pdf.text("Qty", 400, 230);
            pdf.text("Price", 500, 230);
            pdf.line(40, 240, 550, 240);

            // Items List
            let yPos = 260;
            pdf.setTextColor(100, 100, 100);
            order.orderItems.forEach((item) => {
                pdf.text(`${item.name || 'Product'}`, 40, yPos);
                pdf.text(`${item.quantity}`, 405, yPos);
                pdf.text(`Rs ${((item.priceAtTimeOfPurchase || 0) * item.quantity).toFixed(2)}`, 500, yPos);
                yPos += 20;
            });

            // Total
            pdf.line(40, yPos + 10, 550, yPos + 10);
            pdf.setFontSize(14);
            pdf.setTextColor(78, 59, 49);
            pdf.text("Total Paid:", 350, yPos + 40);
            pdf.text(`Rs ${order.totalPrice.toFixed(2)}`, 500, yPos + 40);

            // Footer
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text("Thank you for choosing Markrin!", 40, yPos + 100);

            pdf.save(`Challan_Markrin_${order._id.slice(-8).toUpperCase()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream py-16">
            <div className="max-w-3xl mx-auto px-6">
                <div id="receipt-content" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-center p-8 md:p-12">
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
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-bold text-brand-dark-brown">
                                        ₹{(item.priceAtTimeOfPurchase * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 flex justify-between items-center text-lg">
                                <span className="font-bold text-brand-dark-brown">Total Paid</span>
                                <span className="font-bold text-brand-gold">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div id="receipt-actions" className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button
                            onClick={downloadReceipt}
                            className="px-8 py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-dark-brown transition-all rounded-xl flex items-center justify-center gap-2"
                        >
                            <RiDownload2Line size={18} />
                            Download Receipt
                        </button>
                        <Link
                            to="/orders"
                            className="px-8 py-4 border border-brand-dark-brown text-brand-dark-brown font-bold uppercase tracking-widest text-xs hover:bg-brand-dark-brown hover:text-white transition-all rounded-xl"
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
