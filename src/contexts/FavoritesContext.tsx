import {createContext, useContext, useState, useEffect, ReactNode} from 'react';

import {api} from '../services/api';
import type {IFavoritesItem} from '../types';

interface FavoritesContextType {
  favorites: IFavoritesItem[];
  isLoading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isInFavorites: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({children}: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<IFavoritesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data.items || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addToFavorites = async (productId: string) => {
    try {
      await api.post(`/favorites/${productId}`);
      await fetchFavorites(); // Refresh favorites list
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      await api.delete(`/favorites/${productId}`);
      await fetchFavorites(); // Refresh favorites list
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isInFavorites = (productId: string) => {
    return favorites.some(item => item.product._id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
};
