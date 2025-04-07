import {api} from './api';

import type {Cart} from '../types/cart';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (
    productId: string,
    quantity: number,
  ): Promise<Cart> => {
    const response = await api.delete(`/cart/${productId}`, {
      data: {quantity},
    });
    return response.data;
  },

  updateQuantity: async (
    productId: string,
    quantity: number,
  ): Promise<Cart> => {
    const response = await api.put(`/cart/${productId}`, {
      quantity,
    });
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
