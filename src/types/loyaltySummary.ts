import {IUser} from './user';

export interface LoyaltySummary {
  _id: string;
  user: IUser;
  totalEarned: number;
  totalRedeemed: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}
