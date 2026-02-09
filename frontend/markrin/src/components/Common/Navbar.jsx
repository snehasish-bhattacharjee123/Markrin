import React, { useState } from "react";
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
// import logoimage from "../../assets/Markrin_Logomark.png";
// import logoImage1 from "../../assets/brand name _TM.png";
import logoimage from "../../assets/BNL_WEB.svg";
import logoImage1 from "../../assets/final_logo_cc_website.svg";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "sonner";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

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

  return (
    <>
      <nav className="container flex items-center justify-between px-6 py-4 mx-auto font-inter bg-brand-cream">
        {/* Logo */}

        <button onClick={toggleNavDrawer} >
          <HiBars3BottomRight className="w-6 h-6 text-brand-text cursor-pointer" />
        </button>


        {/* Navigation Links - Desktop */}
        {/* <div className="hidden space-x-6 md:flex">
          {["Shop", "Collections", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-sm font-medium uppercase transition-colors duration-200 text-brand-dark-brown hover:text-brand-gold"
            >
              {item}
            </Link>
          ))}
        </div> */}

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
            {/* <img
              src={logoImage1}
              alt="Markrin"
              className="object-contain w-auto h-10"
            /> */}
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
          {/* {isAuthenticated ? (
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
          )} */}
          {/* User Icon / Login with Dropdown */}
          <div className="relative group">
            {isAuthenticated ? (
              <>
                {/* Trigger: Profile Link */}
                <Link to="/profile" className="flex items-center gap-2 py-2">
                  <HiOutlineUser className="w-6 h-6 transition-colors duration-200 text-brand-dark-brown group-hover:text-brand-gold" />
                  <span className="hidden md:inline text-sm font-medium text-brand-dark-brown group-hover:text-brand-gold">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>

                {/* Dropdown Box */}
                <div className="absolute right-0 top-full w-48 pt-2 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                  <div className="bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden py-2">

                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand-dark-brown">
                      My Account
                    </Link>

                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand-dark-brown">
                      Orders
                    </Link>

                    <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand-dark-brown">
                      Contact Us
                    </Link>

                    <Link to="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand-dark-brown">
                      FAQs
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <RiLogoutCircleLine /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Login Link for Unauthenticated Users */
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-medium text-brand-dark-brown hover:text-brand-gold transition-colors"
              >
                <HiOutlineUser className="w-6 h-6" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </div>

          {/* Wishlist Button */}
          {isAuthenticated && (
            <Link to="/wishlist" className="relative">
              <HiHeart className="w-6 h-6 transition-colors duration-200 text-brand-dark-brown hover:text-brand-gold" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-brand-gold text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart Button */}
          <button onClick={toggleCartDrawer} className="relative">
            <HiOutlineShoppingBag className="w-6 h-6 transition-colors duration-200 text-brand-dark-brown hover:text-brand-gold" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                {totalItems}
              </span>
            )}
          </button>

          <SearchBar />

          {/* Mobile Menu Icon */}
          {/* <button onClick={toggleNavDrawer} >
            <HiBars3BottomRight className="w-6 h-6 text-brand-text" />
          </button> */}
        </div>
      </nav>

      {/* Cart Drawer Component */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-brand-cream shadow-2xl transform transition-transform duration-300 ease-in-out z-50 
  w-3/4 sm:w-1/2 lg:w-1/3 2xl:w-1/4 
  rounded-r-lg lg:rounded-r-xl 2xl:rounded-r-2xl 
  ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}

      >


        <div className="flex items-center justify-between p-4">

          <img
            src={logoImage1}
            alt="Markrin"
            className="object-contain w-auto h-10"
          />

          <button onClick={toggleNavDrawer}>
            <IoMdClose className="w-6 h-6 text-brand-text cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-6">
          {/* User Info in Mobile */}
          {isAuthenticated && (
            <div className="flex items-center pb-4 border-b border-brand-dark-brown">
              <p className="text-sm text-gray-500 uppercase tracking-wider pr-2">
                Hey
              </p>
              <p className="text-xl font-bold text-brand-dark-brown">
                {user?.name}
              </p>
            </div>
          )}

          {/* <h2 className="text-xl font-bold tracking-tight uppercase text-brand-dark-brown">
            Menu
          </h2> */}
          <nav className="flex flex-col space-y-3 ">
            {["Shop", "Collections", "Bulk/CorporateOrders", "About", "Contact"].map((item) => (
              <Link
                key={item}
                onClick={toggleNavDrawer}
                to={`/${item.toLowerCase()}`}
                className="text-lg font-medium uppercase text-brand-text hover:text-brand-white hover:bg-brand-dark-brown m-0 p-4 rounded-lg transition-transform duration-200"
              >
                {item}
              </Link>
            ))}

            {/* Mobile Auth Links */}
            <div className="flex flex-col pt-4 border-t border-brand-dark-brown space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={toggleNavDrawer}
                    className="text-lg font-medium uppercase text-brand-text hover:text-brand-white hover:bg-brand-dark-brown m-0 p-4 rounded-lg transition-transform duration-200"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={toggleNavDrawer}
                    className="flex justify-between items-center text-lg font-medium uppercase text-brand-text hover:text-brand-white hover:bg-brand-dark-brown m-0 p-4 rounded-lg transition-transform duration-200"
                  >
                    <span>My Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="bg-brand-gold text-brand-dark-brown text-xs font-bold rounded-full px-2 py-1">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/faq"
                    onClick={toggleNavDrawer}
                    className="text-lg font-medium uppercase text-brand-text hover:text-brand-white hover:bg-brand-dark-brown m-0 p-4 rounded-lg transition-transform duration-200"
                  >
                    FAQ
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
                    className="flex items-center gap-2 text-lg font-medium uppercase text-brand-maroon-accent hover:text-brand-dark-brown hover:text-brand-white hover:bg-brand-dark-brown m-0 p-4 rounded-lg transition-transform duration-200"
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
