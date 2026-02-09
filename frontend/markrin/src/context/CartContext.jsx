import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }

    setLoading(true);
    try {
      const data = await cartAPI.get();
      setCart(data);
    } catch (err) {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated, refreshCart]);

  const addItem = useCallback(async ({ productId, quantity = 1, size, color }) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setLoading(true);
    try {
      const updated = await cartAPI.addItem(productId, quantity, size, color);
      setCart(updated);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateItem = useCallback(async (itemId, updates) => {
    if (!isAuthenticated) return;

    // Optimistic update - update UI immediately
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item._id === itemId ? { ...item, ...updates } : item
      )
    }));

    try {
      const updated = await cartAPI.updateItem(itemId, updates);
      setCart(updated);
    } catch (err) {
      toast.error(err.message);
      // Revert on error
      refreshCart();
    }
  }, [isAuthenticated, refreshCart]);

  const removeItem = useCallback(async (itemId) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const updated = await cartAPI.removeItem(itemId);
      setCart(updated);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await cartAPI.clear();
      setCart({ items: [] });
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const totalItems = useMemo(() => {
    return cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart.items]);

  const subtotal = useMemo(() => {
    return cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  }, [cart.items]);

  const value = {
    cart,
    loading,
    totalItems,
    subtotal,
    refreshCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
