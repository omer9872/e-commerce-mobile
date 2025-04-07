export interface ProductSubcategory {
  _id: string;
  name: string;
  image: string;
  parent: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  __v: number;
  subcategories: ProductSubcategory[];
}

export interface ProductCategory {
  _id: string;
  name: string;
  image: string;
  parent: string | null;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  createdAt: string;
  description: string;
  subcategories: ProductSubcategory[];
}
