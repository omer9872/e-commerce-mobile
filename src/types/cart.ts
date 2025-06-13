import type {IProduct} from './product';
import {Campaign} from './campaign';

export interface ICartItem {
  product: IProduct;
  quantity: number;
  sku: string;
  price: number;
  discount: number;
  total: number;
  appliedCampaigns?: Campaign[];
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddToCartPayload {
  product: IProduct;
  quantity: number;
  sku: string;
}

export interface IUpdateCartItemPayload {
  quantity: number;
  sku: string;
}

export interface ICartResponse {
  _id: string;
  user: string;
  items: ICartItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
}
