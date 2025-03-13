export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  points: {
    earn: number;
    redeem: number;
  };
  barcode: string;
  images: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
}
