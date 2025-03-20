import {api} from './api';
import type {
  TransactionResponse,
  TransactionDetail,
} from '../types/transaction';

export const fetchTransactions = async (
  page = 0,
  limit = 10,
): Promise<TransactionResponse> => {
  try {
    const response = await api.get(
      `/transaction/my-transactions?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const fetchTransactionById = async (
  id: string,
): Promise<TransactionDetail> => {
  try {
    const response = await api.get(`/transaction/my-transaction/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};
