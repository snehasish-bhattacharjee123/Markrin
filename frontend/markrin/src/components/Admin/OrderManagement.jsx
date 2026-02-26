import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { HiOutlineEye, HiOutlineTruck, HiOutlineCheckCircle } from 'react-icons/hi2';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const { isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    // Fetch stats separately for accurate counts
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminAPI.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getAllOrders(currentPage, 10);
            setOrders(data.orders);
            setTotalPages(data.pages);
            setTotalOrders(data.total);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                <p className="text-gray-500">{orders.length} orders total</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Processing</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {stats?.ordersByStatus?.find(s => s._id === 'Processing')?.count || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Shipped</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {stats?.ordersByStatus?.find(s => s._id === 'Shipped')?.count || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">
                        {stats?.ordersByStatus?.find(s => s._id === 'Delivered')?.count || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-2xl font-bold text-red-600">
                        {stats?.ordersByStatus?.find(s => s._id === 'Cancelled')?.count || 0}
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm text-gray-900">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {order.user?.name || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.user?.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.items?.length || 0} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-gray-900">
                                            ${order.totalPrice?.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.order_status || 'Pending'}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${getStatusColor(order.order_status)}`}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => viewOrderDetails(order)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <HiOutlineEye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-20">
                        <HiOutlineTruck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-600">No orders yet</h3>
                        <p className="text-gray-400">Orders will appear here when customers make purchases</p>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Order Details</h3>
                                <p className="text-sm text-gray-500">
                                    #{selectedOrder._id.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Customer Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {selectedOrder.shippingAddress ? (
                                        <>
                                            <p>{selectedOrder.shippingAddress.address}</p>
                                            <p>
                                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                                            </p>
                                            <p>{selectedOrder.shippingAddress.country}</p>
                                            <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-500">No shipping address provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Order Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                                            <img
                                                src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80'}
                                                alt={item.product?.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-grow">
                                                <p className="font-medium">{item.product?.name || 'Product'}</p>
                                                <div className="text-sm text-gray-500">
                                                    {item.size && <span>Size: {item.size}</span>}
                                                    {item.color && <span className="ml-3">Color: {item.color}</span>}
                                                </div>
                                                <p className="text-sm">
                                                    Qty: {item.quantity} × ${item.price?.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-bold">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>${selectedOrder.totalPrice?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                                    <span>Total</span>
                                    <span className="text-brand-gold">${selectedOrder.totalPrice?.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Update Status</h4>
                                <div className="flex gap-2">
                                    {statusOptions.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                handleStatusChange(selectedOrder._id, status);
                                                setSelectedOrder({ ...selectedOrder, order_status: status });
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOrder.order_status === status
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
