import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
// import logoimage from "../../assets/Markrin_Logomark.png";
// import logoImage1 from "../../assets/brand name _TM.png";
import logoimage from "../../assets/Markrin.svg";
import logoImage1 from "../../assets/Asset 2.svg";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();

  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setNavDrawerOpen(false);
  };

  return (
    <>
      <nav className="container flex items-center justify-between px-6 py-4 mx-auto font-inter bg-brand-cream">
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tighter uppercase text-brand-dark-brown"
          >
            {/* 1. Add your logo image here */}
            <img
              src={logoimage}
              alt="Markrin Logo"
              className="object-contain w-auto h-8"
            />

            {/* 2. Brand Text */}
            <span>Markrin</span>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden space-x-6 md:flex">
          {["Shop", "Collections", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-sm font-medium uppercase transition-colors duration-200 text-brand-dark-brown hover:text-brand-gold"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Logo */}
        {/* <div>
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tighter uppercase text-brand-dark-brown"
          >
            
            <img
              src={logoimage}
              alt="Markrin Logo"
              className="object-contain w-auto h-8"
            />

            

            <img
              src={logoImage1}
              alt="Markrin Logo"
              className="object-contain w-auto h-16"
            />
          </Link>
        </div> */}

        <div>
          <Link to="/" className="flex items-center gap-2 group">
            {/* 1. Logomark (Icon) */}
            <img
              src={logoimage}
              alt="Markrin Icon"
              className="object-contain w-auto h-10 transition-transform duration-200 group-hover:scale-105"
            />

            {/* 2. Brand Wordmark (Text) */}
            <img
              src={logoImage1}
              alt="Markrin"
              className="object-contain w-auto h-10"
            />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Admin Link - Only show if admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:block bg-brand-gold/20 text-brand-dark-brown hover:bg-brand-dark-brown hover:text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              Admin
            </Link>
          )}

          {/* User Icon / Login */}
          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center gap-2">
              <HiOutlineUser className="w-6 h-6 transition-colors duration-200 text-brand-dark-brown hover:text-brand-gold" />
              <span className="hidden md:inline text-sm font-medium text-brand-dark-brown">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-brand-dark-brown hover:text-brand-gold transition-colors"
            >
              <HiOutlineUser className="w-6 h-6" />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}

          {/* Cart Button */}
          <button onClick={toggleCartDrawer} className="relative">
            <HiOutlineShoppingBag className="w-6 h-6 transition-colors duration-200 text-brand-dark-brown hover:text-brand-gold" />
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
              {totalItems}
            </span>
          </button>

          <SearchBar />

          {/* Mobile Menu Icon */}
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="w-6 h-6 text-brand-text" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer Component */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-brand-cream shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="w-6 h-6 text-brand-text" />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-6">
          {/* User Info in Mobile */}
          {isAuthenticated && (
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Welcome,
              </p>
              <p className="text-xl font-bold text-brand-dark-brown">
                {user?.name}
              </p>
            </div>
          )}

          <h2 className="text-xl font-bold tracking-tight uppercase text-brand-dark-brown">
            Menu
          </h2>
          <nav className="flex flex-col space-y-4">
            {["Shop", "Collections", "About", "Contact"].map((item) => (
              <Link
                key={item}
                onClick={toggleNavDrawer}
                to={`/${item.toLowerCase()}`}
                className="text-lg font-medium uppercase text-brand-text hover:text-brand-gold"
              >
                {item}
              </Link>
            ))}

            {/* Mobile Auth Links */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={toggleNavDrawer}
                    className="text-lg font-medium uppercase text-brand-text hover:text-brand-gold"
                  >
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={toggleNavDrawer}
                      className="text-lg font-medium uppercase text-brand-gold hover:text-brand-dark-brown"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-lg font-medium uppercase text-brand-maroon-accent hover:text-brand-dark-brown"
                  >
                    <RiLogoutCircleLine size={20} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleNavDrawer}
                    className="text-lg font-medium uppercase text-brand-text hover:text-brand-gold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleNavDrawer}
                    className="text-lg font-medium uppercase text-brand-gold hover:text-brand-dark-brown"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={toggleNavDrawer}
        ></div>
      )}
    </>
  );
}

export default Navbar;
