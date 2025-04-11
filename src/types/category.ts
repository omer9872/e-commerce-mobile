export interface IProductCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: IProductCategory | string;
  subCategories?: IProductCategory[];

  createdAt: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}
