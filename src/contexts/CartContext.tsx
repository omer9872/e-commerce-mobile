import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

import { cartService } from '../services/cartService';
import type { ICart, ICartItem } from '../types/cart';
import { useAuth } from './AuthContext';

interface CartContextData {
  items: ICartItem[];
  addToCart: (
    productId: string,
    sku: string,
    quantity?: number,
  ) => Promise<void>;
  removeFromCart: (productId: string, sku: string) => Promise<void>;
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
  addCartLoading: boolean;
  removeCartLoading: boolean;
  updateCartLoading: boolean;
  clearCartLoading: boolean;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clearCartLoading, setClearCartLoading] = useState<boolean>(false)
  const [addCartLoading, setAddCartLoading] = useState<boolean>(false)
  const [removeCartLoading, setRemoveCartLoading] = useState<boolean>(false)
  const [updateCartLoading, setUpdateCartLoading] = useState<boolean>(false)
  const { isAuthenticated } = useAuth();
  // Load cart from API on mount
  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [isAuthenticated]);

  const addToCart = async (productId: string, sku: string, quantity = 1) => {
    try {
      setAddCartLoading(true);
      const updatedCart = await cartService.addToCart(productId, sku, quantity);
      setCart(updatedCart);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to add item to cart. Please try again.',
        text2: 'Please try again.',
      });
    } finally {
      setAddCartLoading(false);
    }
  };

  const removeFromCart = async (productId: string, sku: string) => {
    try {
      setRemoveCartLoading(true);
      const updatedCart = await cartService.removeFromCart(productId, sku);
      console.log('updatedCart', updatedCart);
      setCart(updatedCart);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to remove item from cart. Please try again.',
        text2: 'Please try again.',
      });
    } finally {
      setRemoveCartLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    sku: string,
    quantity: number,
  ) => {
    try {
      setUpdateCartLoading(true);
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
      setUpdateCartLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setClearCartLoading(true);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to clear cart. Please try again.',
        text2: 'Please try again.',
      });
    } finally {
      setClearCartLoading(false);
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
        addCartLoading,
        removeCartLoading,
        updateCartLoading,
        clearCartLoading,
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
