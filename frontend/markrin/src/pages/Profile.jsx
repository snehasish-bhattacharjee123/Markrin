import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyOrderPage from "./MyOrderPage";
import { RiLogoutCircleLine, RiUserLine, RiMapPinLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully.");
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-cream font-inter py-10 lg:py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* 1. Profile Sidebar (Left) */}
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
              {user.role === 'admin' && (
                <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                  Admin
                </span>
              )}
              {user.role !== 'admin' && <div className="mb-6"></div>}

              <nav className="w-full space-y-2 mb-10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-dark-brown text-brand-cream font-bold text-xs uppercase tracking-widest transition-all">
                  <RiUserLine size={18} /> Profile Overview
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-bold text-xs uppercase tracking-widest transition-all">
                  <RiMapPinLine size={18} /> Addresses
                </button>
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-brand-maroon-accent/20 text-brand-maroon-accent py-3 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-maroon-accent hover:text-brand-white transition-all duration-300"
              >
                <RiLogoutCircleLine size={18} /> Logout
              </button>
            </div>
          </aside>

          {/* 2. Main Content (Right) */}
          <main className="w-full lg:w-3/4">
            <div className="bg-brand-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50">
                <h2 className="text-xl font-bold text-brand-dark-brown uppercase tracking-tighter">
                  Purchase History
                </h2>
              </div>
              <div className="p-0 sm:p-2">
                <MyOrderPage />
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}

export default Profile;
