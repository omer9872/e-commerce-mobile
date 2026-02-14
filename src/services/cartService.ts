import { api } from './api';

import type { ICart } from '../types/cart';

export const cartService = {
  getCart: async (): Promise<ICart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (
    productId: string,
    sku: string,
    quantity: number,
  ): Promise<ICart> => {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
      sku,
    });
    return response.data;
  },

  removeFromCart: async (productId: string, sku: string): Promise<ICart> => {
    const response = await api.delete(`/cart/${productId}/${sku}`);
    return response.data;
  },

  updateQuantity: async (
    productId: string,
    sku: string,
    quantity: number,
  ): Promise<ICart> => {
    const response = await api.put(`/cart/${productId}`, {
      quantity,
      sku,
    });
    return response.data;
  },

  clearCart: async (): Promise<ICart> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
