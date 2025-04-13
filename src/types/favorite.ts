import {Product} from './product';

export interface IFavoritesItem {
  product: Product;
}

export interface IFavorites {
  _id: string;
  user: string;
  items: IFavoritesItem[];
  createdAt: Date;
  updatedAt: Date;
}
