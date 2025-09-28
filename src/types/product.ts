export enum ProductDiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export interface IProductDiscount {
  type: ProductDiscountType;
  value: number;
}

export interface IProductOption {
  name: string;
  values: string[];
}

export interface IProductVariantOption {
  name: string;
  value: string;
}

export interface IProductVariant {
  options: IProductVariantOption[];
  price: number;
  stock: number;
  volumetricWeight: number;
  sku: string;
}

export type IProduct = {
  _id: string;
  merchant: {
    _id: string;
    user: string;
    website: string;
    logo: string;
  };
  name: string;
  description: string;
  barcode: string;
  images: string[];
  categories: {
    _id: string;
    name: string;
    description: string;
    image: string | null;
  }[];
  isRefundable: boolean;
  refundableDays: number | null;
  brand: {
    _id: string;
    name: string;
    logo: string;
    website: string;
  } | null;
  discount: IProductDiscount | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  options: IProductOption[];
  variants: IProductVariant[];
  averageRating: number;
  reviewCount: number;
};
