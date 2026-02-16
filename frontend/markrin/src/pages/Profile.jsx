import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import {
  RiLogoutCircleLine,
  RiUserLine,
  RiFileListLine,
  RiHeartLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiDashboardLine,
  RiMapPinLine,
  RiSecurePaymentLine,
  RiWalletLine,
  RiQuestionLine,
  RiBookOpenLine,
  RiGroupLine,
  RiShoppingBagLine,
} from "react-icons/ri";
import {
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiCheckCircle,
  HiXCircle,
  HiMagnifyingGlass,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import { authAPI, ordersAPI } from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";
import { validatePincode, getAddressFromPincode } from "../utils/pincodeService";

function Profile() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { addItem } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const { tab } = useParams();
  const location = useLocation();

  // Determine active tab from URL
  const getActiveTabFromURL = () => {
    if (location.pathname === "/orders") return "orders";
    if (tab) return tab;
    return "overview";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
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
  const [pincodeValidating, setPincodeValidating] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeSuccess, setPincodeSuccess] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);



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
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        gender: user.gender || "",
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



  // Sync activeTab with URL changes
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



  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully.");
    navigate("/");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (
      profileData.password &&
      profileData.password !== profileData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    setProfileLoading(true);
    try {
      const updateData = {
        name: profileData.name,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        dob: profileData.dob || null,
        gender: profileData.gender,
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
      setProfileData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (product) => {
    await addItem({ productId: product._id, quantity: 1 });
  };

  if (!user) {
    return null;
  }

  // Sidebar navigation items
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: RiDashboardLine },
    { id: "orders", label: "My Orders", icon: RiFileListLine },
    { id: "addresses", label: "My Addresses", icon: RiMapPinLine },
    { id: "myprofile", label: "My Profile", icon: RiUserLine },
    { id: "wishlist", label: "Wishlist", icon: RiHeartLine },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === "orders") {
      navigate("/orders");
    } else if (tabId === "overview") {
      navigate("/profile");
    } else {
      navigate(`/profile/${tabId}`);
    }
  };

  // Overview grid cards
  const overviewCards = [
    {
      icon: RiShoppingBagLine,
      title: "My Orders",
      subtitle: "View, Modify And Track Orders",
      tab: "orders",
    },
    {
      icon: RiMapPinLine,
      title: "My Addresses",
      subtitle: "Edit, Add Or Remove Addresses",
      tab: "addresses",
    },
    {
      icon: RiUserLine,
      title: "My Profile",
      subtitle: "Edit Personal Info And Change Password",
      tab: "myprofile",
    },
    {
      icon: RiQuestionLine,
      title: "Help & Support",
      subtitle: "Reach Out To Us",
      tab: null,
      link: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream font-inter py-10 lg:py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* ========== SIDEBAR ========== */}
          <aside className="w-full lg:w-[260px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 sticky top-24 overflow-hidden shadow-sm">
              {/* Sidebar nav */}
              <nav className="py-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3.5 px-6 py-3.5 text-sm font-medium transition-all border-l-[3px] ${activeTab === item.id
                        ? "border-brand-gold text-brand-gold bg-brand-gold/5"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-brand-dark-brown"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-6 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all border-l-[3px] border-transparent"
                >
                  <RiLogoutCircleLine className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* ========== MAIN CONTENT ========== */}
          <main className="flex-grow min-w-0">
            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* User Info Card */}
                <div className="bg-brand-gold/10 rounded-2xl p-6 sm:p-8 border border-brand-gold/20">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg shadow-brand-gold/20">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h1 className="text-xl font-bold text-brand-dark-brown">
                        {user.name} {user.lastName || ""}
                      </h1>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleTabClick("myprofile")}
                    className="mt-5 w-full py-3.5 bg-brand-gold text-brand-dark-brown font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-dark-brown hover:text-white transition-all duration-300 shadow-md shadow-brand-gold/20"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Quick Access Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overviewCards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (card.link) {
                          navigate(card.link);
                        } else if (card.tab) {
                          handleTabClick(card.tab);
                        }
                      }}
                      className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-brand-gold/30 hover:shadow-md hover:shadow-brand-gold/5 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/20 transition-colors">
                        <card.icon className="w-6 h-6 text-brand-gold" />
                      </div>
                      <h3 className="font-bold text-sm text-brand-dark-brown mb-1">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {card.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===== MY PROFILE TAB ===== */}
            {activeTab === "myprofile" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-50">
                  <h2 className="text-lg font-bold text-brand-dark-brown">
                    My Profile
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Edit Personal Info And Change Password
                  </p>
                </div>

                <form
                  onSubmit={handleProfileUpdate}
                  className="p-6 sm:p-8 space-y-6"
                >
                  {/* First Name + Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Email Id *
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          maxLength={10}
                          placeholder="Enter mobile number"
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      DOB
                    </label>
                    <input
                      type="date"
                      value={profileData.dob}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          dob: e.target.value,
                        })
                      }
                      placeholder="dd-mm-yyyy"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                    />
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Share your DOB to get special gifts on the 1st day of your
                      birthday month
                    </p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2.5">
                      Gender
                    </label>
                    <div className="flex gap-3">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() =>
                            setProfileData({ ...profileData, gender: g })
                          }
                          className={`px-6 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${profileData.gender === g
                              ? "border-brand-gold bg-brand-gold text-brand-dark-brown"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100" />

                  {/* Password Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">
                        New Password (Optional)
                      </label>
                      <input
                        type="password"
                        value={profileData.password}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            password: e.target.value,
                          })
                        }
                        placeholder="Leave blank to keep current"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">
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
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="px-16 py-4 bg-brand-gold/10 text-brand-dark-brown font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 border border-brand-gold/20"
                    >
                      {profileLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-dark-brown" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===== ADDRESSES TAB ===== */}
            {activeTab === "addresses" && (
              <AddressesTab
                user={user}
                profileData={profileData}
                setProfileData={setProfileData}
                handleProfileUpdate={handleProfileUpdate}
                profileLoading={profileLoading}
                pincodeValidating={pincodeValidating}
                setPincodeValidating={setPincodeValidating}
                pincodeError={pincodeError}
                setPincodeError={setPincodeError}
                pincodeSuccess={pincodeSuccess}
                setPincodeSuccess={setPincodeSuccess}
              />
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-50">
                  <h2 className="text-lg font-bold text-brand-dark-brown">
                    Order History
                  </h2>
                </div>
                <div className="p-0 sm:p-2">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                      <RiFileListLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No orders yet</p>
                      <Link
                        to="/shop"
                        className="inline-block px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
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
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                  {order.shippingAddress?.city},{" "}
                                  {order.shippingAddress?.state}
                                </td>
                                <td className="px-6 py-4 font-bold text-brand-dark-brown">
                                  ₹{order.totalPrice?.toFixed(2)}
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
                                <div
                                  key={index}
                                  className="flex items-center space-x-4"
                                >
                                  <img
                                    src={
                                      item.image ||
                                      "https://via.placeholder.com/50"
                                    }
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-xl"
                                  />
                                  <div>
                                    <p className="font-bold text-brand-dark-brown text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity} • ₹
                                      {item.price?.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString()}
                              </span>
                              <span className="font-bold text-lg text-brand-dark-brown">
                                ₹{order.totalPrice?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ===== WISHLIST TAB ===== */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-50">
                  <h2 className="text-lg font-bold text-brand-dark-brown">
                    My Wishlist
                    {wishlist.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-gray-500 normal-case">
                        ({wishlist.length} item{wishlist.length !== 1 ? "s" : ""})
                      </span>
                    )}
                  </h2>
                </div>
                 <div className="p-6 sm:p-8">
                    {wishlist.length === 0 ? (
                      <div className="text-center py-20">
                        <RiHeartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          Your wishlist is empty
                        </p>
                        <Link
                          to="/shop"
                          className="inline-block px-6 py-3 bg-brand-dark-brown text-white font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-brand-gold hover:text-brand-dark-brown transition-all"
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
                                onClick={() =>
                                  handleRemoveFromWishlist(product._id)
                                }
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
                              <p className="text-xs text-gray-500 mb-2">
                                {product.category}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-brand-gold">
                                  ₹{product.price?.toFixed(2)}
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


                    </>
                  )}
                </div>
              </div>
            )}

            {/* ===== PROFILE TAB (legacy route /profile without sub-tab) ===== */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* User Info Card */}
                <div className="bg-brand-gold/10 rounded-2xl p-6 sm:p-8 border border-brand-gold/20">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg shadow-brand-gold/20">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h1 className="text-xl font-bold text-brand-dark-brown">
                        {user.name} {user.lastName || ""}
                      </h1>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTabClick("myprofile")}
                    className="mt-5 w-full py-3.5 bg-brand-gold text-brand-dark-brown font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-dark-brown hover:text-white transition-all duration-300"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Quick Access Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overviewCards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (card.link) {
                          navigate(card.link);
                        } else if (card.tab) {
                          handleTabClick(card.tab);
                        }
                      }}
                      className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-brand-gold/30 hover:shadow-md hover:shadow-brand-gold/5 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/20 transition-colors">
                        <card.icon className="w-6 h-6 text-brand-gold" />
                      </div>
                      <h3 className="font-bold text-sm text-brand-dark-brown mb-1">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {card.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADDRESSES SUB-COMPONENT
// ============================================================
function AddressesTab({
  user,
  profileData,
  setProfileData,
  handleProfileUpdate,
  profileLoading,
  pincodeValidating,
  setPincodeValidating,
  pincodeError,
  setPincodeError,
  pincodeSuccess,
  setPincodeSuccess,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-gray-50">
        <h2 className="text-lg font-bold text-brand-dark-brown">
          My Addresses
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Edit, Add Or Remove Addresses
        </p>
      </div>

      <form onSubmit={handleProfileUpdate} className="p-6 sm:p-8 space-y-6">
        {/* Street */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
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
            placeholder="House/Flat No., Building, Street, Area"
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
          />
        </div>

        {/* Pincode + City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Pincode
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={profileData.address?.postalCode || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setProfileData({
                    ...profileData,
                    address: { ...profileData.address, postalCode: value },
                  });
                  setPincodeError("");
                  setPincodeSuccess(false);

                  if (value.length === 6) {
                    if (!validatePincode(value)) {
                      setPincodeError(
                        "Please enter a valid 6-digit pincode"
                      );
                      return;
                    }
                    setPincodeValidating(true);
                    getAddressFromPincode(value)
                      .then((result) => {
                        if (result.success) {
                          setProfileData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              postalCode: value,
                              city: result.data.city,
                              state: result.data.state,
                              country: result.data.country || "India",
                            },
                          }));
                          setPincodeSuccess(true);
                        } else {
                          setPincodeError(result.error || "Invalid pincode");
                        }
                        setPincodeValidating(false);
                      })
                      .catch(() => {
                        setPincodeError("Failed to validate pincode");
                        setPincodeValidating(false);
                      });
                  }
                }}
                placeholder="700023"
                className={`w-full px-4 py-3.5 border rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all pr-12 ${pincodeError
                    ? "border-red-300"
                    : pincodeSuccess
                      ? "border-green-300"
                      : "border-gray-200"
                  }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {pincodeValidating ? (
                  <div className="animate-spin h-5 w-5 border-b-2 border-brand-gold rounded-full" />
                ) : pincodeSuccess ? (
                  <HiCheckCircle className="w-5 h-5 text-green-500" />
                ) : pincodeError ? (
                  <HiXCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <HiMagnifyingGlass className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
            {pincodeError && (
              <p className="text-xs text-red-500 mt-1">{pincodeError}</p>
            )}
            {pincodeSuccess && (
              <p className="text-xs text-green-600 mt-1">
                Pincode validated ✓
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">City</label>
            <input
              type="text"
              value={profileData.address?.city || ""}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  address: { ...profileData.address, city: e.target.value },
                })
              }
              readOnly={pincodeSuccess}
              placeholder="Kolkata"
              className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all ${pincodeSuccess ? "bg-green-50/30" : ""
                }`}
            />
          </div>
        </div>

        {/* State + Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">State</label>
            <input
              type="text"
              value={profileData.address?.state || ""}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  address: { ...profileData.address, state: e.target.value },
                })
              }
              readOnly={pincodeSuccess}
              placeholder="West Bengal"
              className={`w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all ${pincodeSuccess ? "bg-green-50/30" : ""
                }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
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
              placeholder="India"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-brand-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
            />
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={profileLoading}
            className="px-16 py-4 bg-brand-gold/10 text-brand-dark-brown font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-brand-gold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 border border-brand-gold/20"
          >
            {profileLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-dark-brown" />
            ) : (
              "Save Address"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
