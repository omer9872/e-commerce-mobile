export interface TransactionCodeResponse {
  _id: string;
  user: string;
  code: string;
  type: string;
  products: {
    product: string;
    quantity: number;
  }[];
  createdBy: string;
  createdAt: string;
}
