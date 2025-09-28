export enum CampaignType {
  DISCOUNT_PERCENTAGE = 'DISCOUNT_PERCENTAGE',
  DISCOUNT_FIXED = 'DISCOUNT_FIXED',
  FREE_ITEM = 'FREE_ITEM',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
}

export enum CampaignTargetType {
  PRODUCT = 'PRODUCT',
  PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
  ALL_PRODUCTS = 'ALL_PRODUCTS',
}

export interface ICampaignCondition {
  minPurchaseAmount?: number;
  maxUsagePerUser?: number;
  minQuantity?: number;
}

export interface ICampaignReward {
  value?: number;
  freeItem?: string;
  getFreeQuantity?: number;
}

export interface ICampaign {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  targetType: CampaignTargetType;
  targets: string[]; // Product IDs or Category IDs
  conditions: ICampaignCondition;
  reward: ICampaignReward;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}
