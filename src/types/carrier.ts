import { IUser } from "./user";

export interface Carrier {
  _id: string;
  user: IUser;
  merchant: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  updatedAt: string | null;
  createdAt: string;
}
