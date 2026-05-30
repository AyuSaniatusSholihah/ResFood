import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Attempt to load from localStorage
    const savedCart = localStorage.getItem('resfood_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Save to localStorage when cart changes
    localStorage.setItem('resfood_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if item already exists based on ID
      const existingItemIndex = prevCart.findIndex(i => i.id === item.id);
      if (existingItemIndex > -1) {
        // Just return the same cart, or you could increment quantity if we had quantities
        // For now, let's just add it if it doesn't exist, or increment quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity = (newCart[existingItemIndex].quantity || 1) + 1;
        return newCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
