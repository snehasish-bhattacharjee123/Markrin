import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CollectionPage from "./pages/CollectionPage";
import Checkout from "./pages/Checkout";
import CartPage from "./pages/CartPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Wishlist from "./pages/Wishlist";
import FAQ from "./pages/FAQ";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import OrderManagement from "./components/Admin/OrderManagement";
import SizeChartManagement from "./components/Admin/SizeChartManagement";

// Guard
import ProtectedRoute from "./components/Common/ProtectedRoute";

import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplaPath: true }}
    >
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster
              position="top-right"
              reverseOrder={false}
              offset={100}
              toastOptions={{
                style: {
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  padding: '12px 16px',
                },
              }}
            />
            <Routes>
              {/* UserLayout acts as the wrapper for all children routes */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile/:tab"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetailsPage />} />
                <Route
                  path="checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route
                  path="order-confirmation/:id"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route path="collections" element={<Shop />} />
                <Route path="collection/:collection" element={<CollectionPage />} />
                {/* Direct category routes */}
                <Route path="hoodies" element={<CollectionPage />} />
                <Route path="oversized" element={<CollectionPage />} />
                <Route path="sweatshirt" element={<CollectionPage />} />
                <Route path="normal-tshirt" element={<CollectionPage />} />
              </Route>


              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminHomePage />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="size-charts" element={<SizeChartManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="users" element={<UserManagement />} />
              </Route>

              {/* 404 Catch-all */}
              <Route path="*" element={<UserLayout />}>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
