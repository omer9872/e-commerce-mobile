import {IProductDiscount} from './product';
import {ICampaign} from './campaign';

export interface IPaymentData {
  service: 'iyzico';
  payload: any;
}

export interface IPaymentProduct {
  product: string;
  merchant: string;
  categories: string[];
  name: string;
  description?: string;
  barcode: string;
  images: string[];
  brand?: {
    _id: string;
    name: string;
    logo: string;
    website: string;
  } | null;
  discount?: IProductDiscount | null;
  quantity: number;
  sku: string;
}

export interface IPayment {
  _id: string;
  user: string;

  products: {
    quantity: number;
    sku: string;
    product: any;
    appliedCampaigns: ICampaign[];
  }[];
  totalPrice: number;

  paymentData: IPaymentData;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
