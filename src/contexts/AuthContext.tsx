'use client';

import type React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {api} from '../services/api';
import type {IUser} from '../types/user';
import {LoyaltySummary} from 'src/types/loyaltySummary';

type UserType = 'customer' | 'merchant' | null;

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType;
  user: IUser;
  loyaltySummary: LoyaltySummary | null;
  permissions: string[];
  roles: string[];
  signInViaPhoneNumber: (credentials: {
    phone: string;
    password: string;
  }) => Promise<void>;
  signInViaEmail: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<IUser>) => Promise<void>;
  refreshLoyaltySummary: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<any>(null);
  const [loyaltySummary, setLoyaltySummary] = useState<LoyaltySummary | null>(
    null,
  );
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const [token, storedUser, storedUserType] = await Promise.all([
        AsyncStorage.getItem('@LoyaltyApp:token'),
        AsyncStorage.getItem('@LoyaltyApp:user'),
        AsyncStorage.getItem('@LoyaltyApp:userType'),
      ]);

      if (token && storedUser && storedUserType) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
        setUserType(storedUserType as UserType);
        setIsAuthenticated(true);
        await refreshLoyaltySummary();
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInViaPhoneNumber(credentials: {
    phone: string;
    password: string;
  }): Promise<void> {
    try {
      const response = await api.post(
        '/auth/login-via-phone-number',
        credentials,
      );
      const {accessToken, refreshToken, roles, permissions} = response.data;

      setPermissions(permissions);
      setRoles(roles);
      setUserType('customer');

      await Promise.all([
        AsyncStorage.setItem('@LoyaltyApp:token', accessToken),
        AsyncStorage.setItem('@LoyaltyApp:refreshToken', refreshToken),
        AsyncStorage.setItem('@LoyaltyApp:roles', JSON.stringify(roles)),
        AsyncStorage.setItem(
          '@LoyaltyApp:permissions',
          JSON.stringify(permissions),
        ),
      ]);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setIsAuthenticated(true);

      await fetchMe();
      await refreshLoyaltySummary();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async function signInViaEmail(credentials: {
    email: string;
    password: string;
  }): Promise<void> {
    try {
      const response = await api.post('/auth/login-via-email', credentials);
      const {accessToken, refreshToken, roles, permissions} = response.data;

      setPermissions(permissions);
      setRoles(roles);
      setUserType('merchant');

      await Promise.all([
        AsyncStorage.setItem('@LoyaltyApp:token', accessToken),
        AsyncStorage.setItem('@LoyaltyApp:refreshToken', refreshToken),
        AsyncStorage.setItem('@LoyaltyApp:roles', JSON.stringify(roles)),
        AsyncStorage.setItem(
          '@LoyaltyApp:permissions',
          JSON.stringify(permissions),
        ),
      ]);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setIsAuthenticated(true);

      await fetchMe();
      await refreshLoyaltySummary();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem('@LoyaltyApp:token'),
        AsyncStorage.removeItem('@LoyaltyApp:user'),
        AsyncStorage.removeItem('@LoyaltyApp:userType'),
      ]);

      setIsAuthenticated(false);
      setUser(null);
      setUserType(null);
      setLoyaltySummary(null);
      delete api.defaults.headers.common.Authorization;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async function updateUser(data: Partial<IUser>): Promise<void> {
    try {
      setUser((prevState: IUser) => ({...prevState, ...data}));
      await AsyncStorage.setItem(
        '@LoyaltyApp:user',
        JSON.stringify({...user, ...data}),
      );
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async function fetchMe(): Promise<void> {
    const response = await api.get('/user/me');
    setUser(response.data);
  }

  async function refreshLoyaltySummary(): Promise<void> {
    try {
      const response = await api.get('/loyalty-summary/me');
      setLoyaltySummary(response.data);
    } catch (error) {
      console.error('Error fetching loyalty summary:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userType,
        user,
        loyaltySummary,
        permissions,
        roles,
        signInViaPhoneNumber,
        signInViaEmail,
        signOut,
        updateUser,
        refreshLoyaltySummary,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
