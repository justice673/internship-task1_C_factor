import React, { createContext, useContext, useState } from 'react';
import { Cart, cartService } from '../services/cartService';

interface CartContextType {
  cart: Cart;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(cartService.getCart());

  const addToCart = (product: any, quantity: number = 1) => {
    const updatedCart = cartService.addToCart(product, quantity);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartService.removeFromCart(productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedCart = cartService.updateQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    const updatedCart = cartService.clearCart();
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
