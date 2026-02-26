import React, { useState, useEffect } from "react";
import { ordersAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const data = await ordersAPI.getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Error loading orders: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-dark-brown mb-8 tracking-tight">
          My Orders
        </h2>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-brand-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-brand-dark-brown text-brand-cream text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Shipping</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-center">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.orderItems[0]?.image || 'https://via.placeholder.com/50'}
                          alt={order.orderItems[0]?.name || 'Product'}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        />
                        <span className="font-medium text-brand-dark-brown">
                          {order.orderItems[0]?.name || 'Product'}
                          {order.orderItems.length > 1 &&
                            ` +${order.orderItems.length - 1} more`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-text">
                      ₹{order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center space-y-2">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.order_status === 'Delivered' ? "bg-green-100 text-green-700"
                            : order.order_status === 'Cancelled' ? "bg-red-100 text-red-700"
                              : order.order_status === 'Processing' ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {order.order_status || 'Pending'}
                      </div><br />
                      <div className="text-[10px] font-bold text-gray-400">
                        {order.isPaid ? 'Paid' : 'Pending Payment'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-gray-400 text-center uppercase tracking-widest text-xs"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-brand-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                      Order ID
                    </p>
                    <p className="font-bold text-brand-dark-brown">
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${order.order_status === 'Delivered' ? "bg-green-100 text-green-700"
                        : order.order_status === 'Cancelled' ? "bg-red-100 text-red-700"
                          : order.order_status === 'Processing' ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.order_status || 'Pending'}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {order.isPaid ? 'Paid' : 'Pending Payment'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.image || 'https://via.placeholder.com/50'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div>
                        <p className="font-bold text-brand-text text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} • ₹{item.priceAtTimeOfPurchase?.toFixed(2) || item.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-lg text-brand-dark-brown">
                    ₹{order.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-brand-white rounded-2xl text-gray-400 uppercase text-xs tracking-widest">
              No orders found.
            </div>
          )}
        </div>
      </div >
    </div >
  );
};

export default MyOrderPage;
