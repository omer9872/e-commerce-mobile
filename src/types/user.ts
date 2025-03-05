export interface IUser {
  _id: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
  fcmToken?: string;

  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
