export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  points: number;
  barcode: string;
  images: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
}
