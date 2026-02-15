import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiHeart,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import logoimage from "../../assets/BNL_WEB.svg";
import logoImage1 from "../../assets/final_logo_cc_website.svg";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "sonner";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setNavDrawerOpen(false);
  };

  // Sticky nav scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`transition-all duration-300 font-inter ${scrolled
          ? "bg-brand-cream/95 backdrop-blur-md shadow-sm border-b border-brand-gold/10"
          : "bg-brand-cream"
          }`}
      >
        <div className="container flex items-center justify-between px-6 py-3.5 mx-auto">
          {/* Left: Hamburger Menu */}
          <button
            onClick={toggleNavDrawer}
            className="p-1.5 rounded-lg hover:bg-brand-dark-brown/5 transition-colors duration-200"
            aria-label="Menu"
          >
            <HiBars3BottomRight className="w-6 h-6 text-brand-dark-brown" />
          </button>

          {/* Center: Logo */}
          <div>
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={logoimage}
                alt="Markrin Icon"
                className="object-contain w-auto h-10 transition-all duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 bg-brand-gold/15 text-brand-dark-brown hover:bg-brand-dark-brown hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                Admin
              </Link>
            )}

            {/* User Dropdown */}
            <div className="relative group">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 py-2 px-1"
                  >
                    <div className="relative">
                      <HiOutlineUser className="w-[22px] h-[22px] text-brand-dark-brown group-hover:text-brand-gold transition-colors duration-200" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-brand-green-accent rounded-full border-2 border-brand-cream" />
                    </div>
                    <span className="hidden md:inline text-sm font-semibold text-brand-dark-brown group-hover:text-brand-gold transition-colors">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full w-52 pt-3 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100/80 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-brand-gold/10 to-transparent border-b border-gray-100">
                        <p className="text-xs font-bold text-brand-dark-brown truncate">
                          {user?.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1.5">
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-cream hover:text-brand-dark-brown transition-colors"
                        >
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-cream hover:text-brand-dark-brown transition-colors"
                        >
                          Orders
                        </Link>
                        <Link
                          to="/contact"
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-cream hover:text-brand-dark-brown transition-colors"
                        >
                          Contact Us
                        </Link>
                        <Link
                          to="/faq"
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-cream hover:text-brand-dark-brown transition-colors"
                        >
                          FAQs
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <RiLogoutCircleLine className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-semibold text-brand-dark-brown hover:text-brand-gold transition-colors duration-200"
                >
                  <HiOutlineUser className="w-[22px] h-[22px]" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}
            </div>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative p-1 hover:scale-110 transition-transform duration-200"
              >
                <HiHeart className="w-[22px] h-[22px] text-brand-dark-brown hover:text-brand-gold transition-colors duration-200" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-brand-maroon-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCartDrawer}
              className="relative p-1 hover:scale-110 transition-transform duration-200"
            >
              <HiOutlineShoppingBag className="w-[22px] h-[22px] text-brand-dark-brown hover:text-brand-gold transition-colors duration-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-brand-maroon-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            <SearchBar />
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* ============================================ */}
      {/* Mobile Navigation Drawer */}
      {/* ============================================ */}
      <div
        className={`fixed top-0 left-0 h-full bg-brand-cream shadow-2xl transform transition-transform duration-300 ease-in-out z-[60]
          w-[85%] sm:w-80 lg:w-96
          ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-dark-brown/10">
          <img
            src={logoImage1}
            alt="Markrin"
            className="object-contain w-auto h-9"
          />
          <button
            onClick={toggleNavDrawer}
            className="p-1.5 rounded-lg hover:bg-brand-dark-brown/10 transition-colors"
          >
            <IoMdClose className="w-6 h-6 text-brand-dark-brown" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col p-6 space-y-2 overflow-y-auto h-[calc(100%-72px)]">
          {/* User Greeting */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 pb-5 mb-3 border-b border-brand-dark-brown/10">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-brand-dark-brown rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Welcome back
                </p>
                <p className="text-base font-bold text-brand-dark-brown truncate">
                  {user?.name}
                </p>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex flex-col space-y-1">
            {[
              { label: "Shop", path: "/shop" },
              { label: "Collections", path: "/collections" },
              { label: "Bulk / Corporate Orders", path: "/bulk/corporateorders" },
              { label: "About", path: "/about" },
              { label: "Contact", path: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                onClick={toggleNavDrawer}
                to={item.path}
                className="text-base font-semibold uppercase text-brand-dark-brown hover:text-white hover:bg-brand-dark-brown px-4 py-3 rounded-xl transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex flex-col pt-4 mt-2 border-t border-brand-dark-brown/10 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={toggleNavDrawer}
                  className="text-base font-semibold uppercase text-brand-dark-brown hover:text-white hover:bg-brand-dark-brown px-4 py-3 rounded-xl transition-all duration-200"
                >
                  My Profile
                </Link>
                <Link
                  to="/wishlist"
                  onClick={toggleNavDrawer}
                  className="flex justify-between items-center text-base font-semibold uppercase text-brand-dark-brown hover:text-white hover:bg-brand-dark-brown px-4 py-3 rounded-xl transition-all duration-200"
                >
                  <span>My Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-brand-gold text-brand-dark-brown text-[10px] font-bold rounded-full px-2 py-0.5">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/faq"
                  onClick={toggleNavDrawer}
                  className="text-base font-semibold uppercase text-brand-dark-brown hover:text-white hover:bg-brand-dark-brown px-4 py-3 rounded-xl transition-all duration-200"
                >
                  FAQ
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={toggleNavDrawer}
                    className="text-base font-semibold uppercase text-brand-gold hover:text-white hover:bg-brand-dark-brown px-4 py-3 rounded-xl transition-all duration-200"
                  >
                    ⚡ Admin Panel
                  </Link>
                )}

                <div className="pt-3 mt-3 border-t border-brand-dark-brown/10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full text-base font-semibold uppercase text-brand-maroon-accent hover:text-white hover:bg-brand-maroon-accent px-4 py-3 rounded-xl transition-all duration-200"
                  >
                    <RiLogoutCircleLine className="w-5 h-5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleNavDrawer}
                  className="text-base font-semibold uppercase text-brand-dark-brown hover:text-white hover:bg-brand-dark-brown px-4 py-3 rounded-xl transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleNavDrawer}
                  className="text-base font-semibold uppercase text-brand-gold hover:text-white hover:bg-brand-gold px-4 py-3 rounded-xl transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleNavDrawer}
        />
      )}
    </>
  );
}

export default Navbar;
