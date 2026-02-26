import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { adminAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const AdminHomePage = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAdmin, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminAPI.getStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Error loading dashboard: {error}
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 shadow-md rounded-lg bg-white">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Revenue</h2>
                    <p className='text-3xl font-bold text-green-600 mt-2'>
                        ${stats.totalRevenue?.toFixed(2) || '0.00'}
                    </p>
                </div>

                <div className="p-6 shadow-md rounded-lg bg-white">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Orders</h2>
                    <p className='text-3xl font-bold text-brand-dark-brown mt-2'>{stats.totalOrders}</p>
                    <Link to="/admin/orders" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
                        Manage Orders
                    </Link>
                </div>

                <div className="p-6 shadow-md rounded-lg bg-white">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Products</h2>
                    <p className='text-3xl font-bold text-brand-dark-brown mt-2'>{stats.totalProducts}</p>
                    <Link to="/admin/products" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
                        Manage Products
                    </Link>
                </div>

                <div className="p-6 shadow-md rounded-lg bg-white">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Users</h2>
                    <p className='text-3xl font-bold text-brand-dark-brown mt-2'>{stats.totalUsers}</p>
                    <Link to="/admin/users" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
                        Manage Users
                    </Link>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto shadow-sm rounded-lg border">
                    <table className="min-w-full text-left text-gray-500">
                        <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                            <tr>
                                <th className='py-3 px-4'>Order ID</th>
                                <th className='py-3 px-4'>User</th>
                                <th className='py-3 px-4'>Total Price</th>
                                <th className='py-3 px-4'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order) => (
                                    <tr key={order._id} className='border-b hover:bg-gray-50 transition-colors'>
                                        <td className='p-4 text-gray-900 font-medium font-mono text-sm'>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className='p-4'>{order.user?.name || 'N/A'}</td>
                                        <td className='p-4 font-semibold'>${order.totalPrice?.toFixed(2)}</td>
                                        <td className='p-4'>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.order_status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                        order.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.order_status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className='p-10 text-center text-gray-500'>
                                        No Recent Orders Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
