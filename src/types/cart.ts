import {Product} from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  total: number;
  appliedCampaigns: Campaign[];
}

export interface Campaign {
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetType: string;
  targets: any[];
  conditions: {
    minPurchaseAmount: number | null;
    minQuantity: number | null;
    maxUsagePerUser: number | null;
    maxTotalUsage: number | null;
    multiplePurchases: boolean;
  };
  reward: {
    type: string;
    value: number;
    freeItem: any | null;
    buyQuantity: number;
    getFreeQuantity: number;
  };
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  _id: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
} 