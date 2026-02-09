import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { wishlistAPI } from '../api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const WishlistContext = createContext(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Fetch wishlist
    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            setWishlistCount(0);
            return;
        }

        setLoading(true);
        try {
            const data = await wishlistAPI.get(1, 100); // Get all wishlist items
            setWishlist(data.products || []);
            setWishlistCount(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch wishlist:', err);
            setWishlist([]);
            setWishlistCount(0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Initial load
    useEffect(() => {
        fetchWishlist();
    }, [isAuthenticated, fetchWishlist]);

    // Add to wishlist
    const addToWishlist = useCallback(async (productId) => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to wishlist');
            return false;
        }

        setLoading(true);
        try {
            await wishlistAPI.add(productId);
            await fetchWishlist(); // Refresh wishlist
            toast.success('Added to wishlist');
            return true;
        } catch (err) {
            toast.error(err.message || 'Failed to add to wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, fetchWishlist]);

    // Remove from wishlist
    const removeFromWishlist = useCallback(async (productId) => {
        if (!isAuthenticated) return false;

        setLoading(true);
        try {
            await wishlistAPI.remove(productId);
            await fetchWishlist(); // Refresh wishlist
            toast.success('Removed from wishlist');
            return true;
        } catch (err) {
            toast.error(err.message || 'Failed to remove from wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, fetchWishlist]);

    // Toggle wishlist
    const toggleWishlist = useCallback(async (productId) => {
        const isInWishlist = wishlist.some(item => item._id === productId);
        if (isInWishlist) {
            return await removeFromWishlist(productId);
        } else {
            return await addToWishlist(productId);
        }
    }, [wishlist, addToWishlist, removeFromWishlist]);

    // Check if product is in wishlist
    const isInWishlist = useCallback((productId) => {
        return wishlist.some(item => item._id === productId);
    }, [wishlist]);

    const value = {
        wishlist,
        loading,
        wishlistCount,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;
