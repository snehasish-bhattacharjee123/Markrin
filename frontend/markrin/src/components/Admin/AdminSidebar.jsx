import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaChartBar,
    FaSignOutAlt,
    FaStore
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const menuItems = [
        { path: '/admin', icon: FaHome, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: FaBox, label: 'Products' },
        { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
        { path: '/admin/users', icon: FaUsers, label: 'Users' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center">
                        <FaStore className="w-5 h-5 text-brand-dark-brown" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tighter">
                            Markrin<span className="text-brand-gold">.</span>
                        </h1>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-grow p-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-brand-gold text-brand-dark-brown'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                        <span className="text-brand-gold font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.name || 'Admin'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <FaSignOutAlt className="w-5 h-5" />
                    Logout
                </button>

                <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all mt-1"
                >
                    <FaStore className="w-5 h-5" />
                    Back to Store
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;
