import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  RiLogoutCircleLine,
  RiUserLine,
  RiFileListLine,
  RiHeartLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine
} from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { authAPI, ordersAPI, wishlistAPI } from "../api";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineTrash } from "react-icons/hi2";

function Profile() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { tab } = useParams();
  const location = useLocation();

  // Determine active tab from URL
  const getActiveTabFromURL = () => {
    if (location.pathname === '/orders') return 'orders';
    if (tab) return tab;
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [wishlistPages, setWishlistPages] = useState(1);
  const [wishlistTotal, setWishlistTotal] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Initialize profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "",
        },
      });
    }
  }, [user]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  // Fetch wishlist when wishlist tab is active
  useEffect(() => {
    if (activeTab === "wishlist" && isAuthenticated) {
      fetchWishlist(wishlistPage);
    }
  }, [activeTab, isAuthenticated, wishlistPage]);

  // Sync activeTab with URL changes (for browser back/forward)
  useEffect(() => {
    const newTab = getActiveTabFromURL();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname, tab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersAPI.getMyOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchWishlist = async (page = 1) => {
    setWishlistLoading(true);
    try {
      const data = await wishlistAPI.get(page, 6);
      setWishlist(data.products || []);
      setWishlistPages(data.pages || 1);
      setWishlistTotal(data.total || 0);
    } catch (err) {
      toast.error("Failed to load wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully.");
    navigate("/");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setProfileLoading(true);
    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
      };

      if (profileData.password) {
        updateData.password = profileData.password;
      }

      if (profileData.address) {
        updateData.address = profileData.address;
      }

      const updatedUser = await authAPI.updateProfile(updateData);

      // Update local storage and context
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const newUserInfo = { ...userInfo, ...updatedUser };
      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));

      if (updateUser) {
        updateUser(updatedUser);
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setProfileData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      toast.success("Removed from wishlist");
      fetchWishlist(wishlistPage);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddToCart = async (product) => {
    await addItem({ productId: product._id, quantity: 1 });
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: RiUserLine },
    { id: "orders", label: "Orders", icon: RiFileListLine },
    { id: "wishlist", label: "Wishlist", icon: RiHeartLine },
  ];

  return (
    <div className="min-h-screen bg-brand-cream font-inter py-10 lg:py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-brand-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center lg:items-start lg:text-left sticky top-24">
              {/* Avatar Circle */}
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 text-brand-gold">
                <RiUserLine size={40} />
              </div>

              <h1 className="text-2xl font-bold text-brand-dark-brown mb-1">
                {user.name}
              </h1>
              <p className="text-sm text-gray-500 mb-2 tracking-wide">
                {user.email}
              </p>
              {user.role === "admin" && (
                <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                  Admin
                </span>
              )}
              {user.role !== "admin" && <div className="mb-6"></div>}

              {/* Tab Navigation */}
              <nav className="w-full space-y-2 mb-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'orders') {
                        navigate('/orders');
                      } else if (tab.id === 'profile') {
                        navigate('/profile');
                      } else {
                        navigate(`/profile/${tab.id}`);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
                      ? "bg-brand-dark-brown text-brand-cream"
                      : "hover:bg-gray-50 text-gray-600"
                      }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-brand-maroon-accent/20 text-brand-maroon-accent py-3 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-maroon-accent hover:text-brand-white transition-all duration-300"
              >
                <RiLogoutCircleLine size={18} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4">
            <div className="bg-brand-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <>
                  <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark-brown uppercase tracking-tighter">
                      Profile Overview
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isEditing
                        ? "bg-gray-100 text-gray-600"
                        : "bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-dark-brown"
                        }`}
                    >
                      {isEditing ? (
                        <>
                          <RiCloseLine size={16} />
                          Cancel
                        </>
                      ) : (
                        <>
                          <RiEditLine size={16} />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-6 md:p-8">
                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({ ...profileData, name: e.target.value })
                            }
                            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({ ...profileData, email: e.target.value })
                            }
                            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            required
                          />
                        </div>

                        {/* Address Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                              Street Address
                            </label>
                            <input
                              type="text"
                              value={profileData.address?.street || ""}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  address: { ...profileData.address, street: e.target.value },
                                })
                              }
                              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={profileData.address?.city || ""}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  address: { ...profileData.address, city: e.target.value },
                                })
                              }
                              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              value={profileData.address?.state || ""}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  address: { ...profileData.address, state: e.target.value },
                                })
                              }
                              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              value={profileData.address?.postalCode || ""}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  address: { ...profileData.address, postalCode: e.target.value },
                                })
                              }
                              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              value={profileData.address?.country || ""}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  address: { ...profileData.address, country: e.target.value },
                                })
                              }
                              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                              New Password (Optional)
                            </label>
                            <input
                              type="password"
                              value={profileData.password}
                              onChange={(e) =>
                                setProfileData({ ...profileData, password: e.target.value })
                              }
                              placeholder="Leave blank to keep current"
                              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={profileData.confirmPassword}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              placeholder="Confirm new password"
                              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={profileLoading}
                          className="w-full py-4 bg-brand-dark-brown text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {profileLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <RiCheckLine size={18} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                              Full Name
                            </p>
                            <p className="text-lg font-semibold text-brand-dark-brown">
                              {user.name}
                            </p>
                          </div>
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                              Email Address
                            </p>
                            <p className="text-lg font-semibold text-brand-dark-brown">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                              Shipping Address
                            </p>
                            <p className="text-lg font-semibold text-brand-dark-brown">
                              {user.address?.street ? (
                                <>
                                  {user.address.street}, {user.address.city},<br />
                                  {user.address.state}, {user.address.postalCode},<br />
                                  {user.address.country}
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm italic">No address set</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                              Account Type
                            </p>
                            <p className="text-lg font-semibold text-brand-dark-brown capitalize">
                              {user.role}
                            </p>
                          </div>
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                              Member Since
                            </p>
                            <p className="text-lg font-semibold text-brand-dark-brown">
                              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <>
                  <div className="p-6 md:p-8 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-brand-dark-brown uppercase tracking-tighter">
                      Order History
                    </h2>
                  </div>

                  <div className="p-0 sm:p-2">
                    {ordersLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-20">
                        <RiFileListLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No orders yet</p>
                        <Link
                          to="/shop"
                          className="inline-block px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="min-w-full text-sm text-left">
                            <thead className="bg-brand-dark-brown text-brand-cream text-xs uppercase tracking-widest">
                              <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Shipping</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {orders.map((order) => (
                                <tr
                                  key={order._id}
                                  className="hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={
                                          order.orderItems[0]?.image ||
                                          "https://via.placeholder.com/50"
                                        }
                                        alt={order.orderItems[0]?.name || "Product"}
                                        className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                                      />
                                      <span className="font-medium text-brand-dark-brown">
                                        {order.orderItems[0]?.name || "Product"}
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
                                    ${order.totalPrice?.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span
                                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "Cancelled"
                                          ? "bg-red-100 text-red-700"
                                          : order.status === "Shipped"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                      {order.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4 p-4">
                          {orders.map((order) => (
                            <div
                              key={order._id}
                              className="bg-gray-50 p-5 rounded-2xl"
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
                                <span
                                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "Cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {order.status}
                                </span>
                              </div>

                              <div className="space-y-4">
                                {order.orderItems.slice(0, 2).map((item, index) => (
                                  <div key={index} className="flex items-center space-x-4">
                                    <img
                                      src={item.image || "https://via.placeholder.com/50"}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded-xl"
                                    />
                                    <div>
                                      <p className="font-bold text-brand-text text-sm">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Qty: {item.quantity} • ${item.price?.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                                <span className="font-bold text-lg text-brand-dark-brown">
                                  ${order.totalPrice?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <>
                  <div className="p-6 md:p-8 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-brand-dark-brown uppercase tracking-tighter">
                      My Wishlist
                      {wishlistTotal > 0 && (
                        <span className="ml-2 text-sm font-normal text-gray-500 normal-case">
                          ({wishlistTotal} item{wishlistTotal !== 1 ? "s" : ""})
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="p-6 md:p-8">
                    {wishlistLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
                      </div>
                    ) : wishlist.length === 0 ? (
                      <div className="text-center py-20">
                        <RiHeartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                        <Link
                          to="/shop"
                          className="inline-block px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
                        >
                          Browse Products
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {wishlist.map((product) => (
                            <div
                              key={product._id}
                              className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all"
                            >
                              <div className="relative">
                                <Link to={`/product/${product._id}`}>
                                  <img
                                    src={
                                      product.images?.[0]?.url ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt={product.name}
                                    className="w-full h-40 object-cover"
                                  />
                                </Link>
                                <button
                                  onClick={() => handleRemoveFromWishlist(product._id)}
                                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="p-4">
                                <Link to={`/product/${product._id}`}>
                                  <h3 className="font-semibold text-brand-dark-brown text-sm line-clamp-1 hover:text-brand-gold transition-colors">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-brand-gold">
                                    ${product.price?.toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.countInStock === 0}
                                    className={`p-2 rounded-lg text-xs font-bold uppercase transition-all ${product.countInStock === 0
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-brand-dark-brown text-white hover:bg-brand-gold hover:text-brand-dark-brown"
                                      }`}
                                  >
                                    <HiOutlineShoppingBag className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {wishlistPages > 1 && (
                          <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                              onClick={() => setWishlistPage((p) => Math.max(1, p - 1))}
                              disabled={wishlistPage === 1}
                              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              Previous
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-600">
                              Page {wishlistPage} of {wishlistPages}
                            </span>
                            <button
                              onClick={() =>
                                setWishlistPage((p) => Math.min(wishlistPages, p + 1))
                              }
                              disabled={wishlistPage === wishlistPages}
                              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;
