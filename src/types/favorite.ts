import {IProduct} from './product';

export interface IFavoritesItem {
  product: IProduct;
}

export interface IFavorites {
  _id: string;
  user: string;
  items: IFavoritesItem[];
  createdAt: Date;
  updatedAt: Date;
}
