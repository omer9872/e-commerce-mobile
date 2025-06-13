export interface IProductOption {
  name: string; // e.g., "Color", "Size"
  values: string[]; // e.g., ["Red", "Blue"] or ["S", "M", "L"]
  required: boolean; // whether this option is required for purchase
}

export interface IProductVariant {
  options: {
    [key: string]: string; // e.g., { "Color": "Red", "Size": "M" }
  };
  price: number; // optional price override for this variant
  stock: number; // stock level for this specific variant
  sku: string; // unique identifier for this variant
}

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  barcode: string;
  images: string[];
  categories: string[];
  isRefundable: boolean;
  refundableDays?: number;
  options: IProductOption[];
  variants: IProductVariant[];

  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
}
