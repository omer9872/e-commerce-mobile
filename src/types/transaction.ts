import {Product} from './product';
import {IUser} from './user';

export enum TransactionType {
  EARN = 'earn',
  REDEEM = 'redeem',
  PURCHASE = 'purchase',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  POINTS = 'points',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ITransactionProduct {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface Transaction {
  _id: string;

  user: string;
  type: TransactionType;
  items: ITransactionProduct[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  totalPoints: number;
  code?: string;
  payment?: string;

  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface TransactionDetail {
  _id: string;
  user: IUser;
  type: TransactionType;
  items: {
    product: Product;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  totalPoints: number;
  code: null;
  payment: string;
  createdBy: string;
  createdAt: string;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}
