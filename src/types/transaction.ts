import {Product} from './product';
import {IUser} from './user';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ShippingType {
  CARRIER = 'carrier',
  SELF_PICKUP = 'self_pickup',
}

export enum ShippingStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  ON_THE_WAY = 'on_the_way',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface ITransactionProduct {
  product: string;
  quantity: number;
}

export interface ITransaction {
  _id: string;

  user: string;
  items: ITransactionProduct[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingType: ShippingType;
  shippingStatus: ShippingStatus;
  totalAmount: number;
  code?: string;
  payment?: string;

  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface TransactionDetail {
  _id: string;
  user: IUser;
  items: {
    product: Product;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingType: ShippingType;
  shippingStatus: ShippingStatus;
  totalAmount: number;
  totalPoints: number;
  code: null;
  payment: string;
  createdBy: string;
  createdAt: string;
}

export interface TransactionResponse {
  data: ITransaction[];
  total: number;
  page: number;
  limit: number;
}
