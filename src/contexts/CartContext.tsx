import React, {createContext, useContext, useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';

import {cartService} from '../services/cartService';
import type {ICart, ICartItem} from '../types/cart';

interface CartContextData {
  items: ICartItem[];
  addToCart: (
    productId: string,
    sku: string,
    quantity?: number,
  ) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    sku: string,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  totalDiscount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        const cartData = await cartService.getCart();
        setCart(cartData);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to load cart. Please try again.',
          text2: 'Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (productId: string, sku: string, quantity = 1) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartService.addToCart(productId, sku, quantity);
      setCart(updatedCart);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to add item to cart. Please try again.',
        text2: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (sku: string) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartService.removeFromCart(sku);
      setCart(updatedCart);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to remove item from cart. Please try again.',
        text2: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    sku: string,
    quantity: number,
  ) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartService.updateQuantity(
        productId,
        sku,
        quantity,
      );
      setCart(updatedCart);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update quantity. Please try again.',
        text2: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to clear cart. Please try again.',
        text2: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems =
    (cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0) || 0;

  const totalPrice = cart?.total || 0;
  const subtotal = cart?.subtotal || 0;
  const totalDiscount = cart?.totalDiscount || 0;

  return (
    <CartContext.Provider
      value={{
        items: cart?.items || [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        subtotal,
        totalDiscount,
        isLoading,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
