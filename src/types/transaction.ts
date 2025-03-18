export interface Transaction {
  _id: string;
  user: string;
  type: string;
  items: any[];
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  totalPoints: number;
  code: string | null;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  createdAt: string;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}
