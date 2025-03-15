import {api} from './api';
import type {UserInformation} from '../types/address';
import type {Address} from '../types/address';

export const fetchUserInformation = async (): Promise<UserInformation> => {
  const response = await api.get('/end-user-information/me');
  return response.data;
};

export const addAddress = async (
  address: Omit<Address, '_id'>,
): Promise<UserInformation> => {
  const response = await api.post('/end-user-information/address', address);
  return response.data;
};

export const updateAddress = async (
  addressId: string,
  address: Omit<Address, '_id'>,
): Promise<UserInformation> => {
  // For updating an address, we use POST to the same endpoint as adding
  // We'll include the addressId in the payload
  const response = await api.put(`/end-user-information/address/${addressId}`, {
    ...address,
  });
  return response.data;
};

export const deleteAddress = async (
  addressId: string,
): Promise<UserInformation> => {
  const response = await api.delete(
    `/end-user-information/address/${addressId}`,
  );
  return response.data;
};

export const setDefaultAddress = async (
  addressId: string,
): Promise<UserInformation> => {
  const response = await api.put(
    `/end-user-information/address/${addressId}/default`,
  );
  return response.data;
};
