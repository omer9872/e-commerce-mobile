import {IPayment} from './payment';
import {IProduct} from './product';
import {Carrier} from './carrier';

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

export enum ShippingStatusLabel {
  pending = 'Pending',
  shipped = 'Shipped',
  on_the_way = 'On the way',
  delivered = 'Delivered',
  cancelled = 'Cancelled',
}

export interface ITransactionProduct {
  product: string | IProduct;
  quantity: number;
  sku: string;
}

export interface ITransaction {
  _id: string;

  user: string;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  payment?: IPayment;

  shippingType: ShippingType;
  shippingStatus: ShippingStatus;
  carrier?: string | Carrier;

  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
