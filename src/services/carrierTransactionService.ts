import {api} from './api';
import type {
  TransactionResponse,
  TransactionDetail,
  ShippingStatus,
} from '../types/transaction';

export const fetchCarrierTransactions = async (
  page = 0,
  limit = 10,
): Promise<TransactionResponse> => {
  try {
    const response = await api.get(
      `/carrier-transaction/my-transactions?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const fetchCarrierTransactionById = async (
  id: string,
): Promise<TransactionDetail> => {
  try {
    const response = await api.get(`/carrier-transaction/my-transaction/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

export const updateCarrierTransactionShippingStatus = async (
  id: string,
  status: ShippingStatus,
) => {
  const response = await api.put(`/carrier-transaction/${id}/shipping-status`, {
    shippingStatus: status,
  });
  return response.data;
};
