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

export interface ITransactionItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    isRefundable: boolean;
  };
  quantity: number;
  sku: string;
}

export interface ITransaction {
  _id: string;
  user: string | IUser;
  items: ITransactionItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  payment?: string;
  shippingType: ShippingType;
  shippingStatus: ShippingStatus;
  carrier?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}
