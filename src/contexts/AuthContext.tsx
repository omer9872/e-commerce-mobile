'use client';

import type React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {api} from '../services/api';
import type {IUser} from '../types/user';
import type {LoyaltySummary} from 'src/types/loyaltySummary';

type UserType = 'customer' | 'merchant' | 'merchantEmployee' | null;

type User = IUser & {verification: {email: boolean; phone: boolean}};

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType;
  user: User | null;
  loyaltySummary: LoyaltySummary | null;
  permissions: string[];
  roles: string[];
  fetchMe: () => Promise<void>;
  signInViaPhoneNumber: (credentials: {
    phone: string;
    password: string;
  }) => Promise<void>;
  signInViaEmail: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshLoyaltySummary: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<User | null>(null);
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
      setIsLoading(true);
      const [token, storedUser, storedUserType] = await Promise.all([
        AsyncStorage.getItem('@LoyaltyApp:token'),
        AsyncStorage.getItem('@LoyaltyApp:user'),
        AsyncStorage.getItem('@LoyaltyApp:userType'),
      ]);

      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        try {
          // Validate token by fetching user data
          await fetchMe();

          if (storedUserType) {
            setUserType(storedUserType as UserType);
          }

          setIsAuthenticated(true);
          await refreshLoyaltySummary();
        } catch (error) {
          console.error('Token validation failed:', error);
          // Token is invalid or expired, clear storage and redirect to login
          await handleAuthFailure();
        }
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
      await handleAuthFailure();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAuthFailure(): Promise<void> {
    // Clear all auth-related data from storage
    await Promise.all([
      AsyncStorage.removeItem('@LoyaltyApp:token'),
      AsyncStorage.removeItem('@LoyaltyApp:refreshToken'),
      AsyncStorage.removeItem('@LoyaltyApp:user'),
      AsyncStorage.removeItem('@LoyaltyApp:userType'),
      AsyncStorage.removeItem('@LoyaltyApp:roles'),
      AsyncStorage.removeItem('@LoyaltyApp:permissions'),
      AsyncStorage.removeItem('@LoyaltyApp:cart'),
    ]);

    // Reset auth state
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    setLoyaltySummary(null);
    setPermissions([]);
    setRoles([]);
    delete api.defaults.headers.common.Authorization;
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
      const {
        accessToken,
        refreshToken,
        roles,
        permissions,
        userType: responseUserType,
      } = response.data;

      setPermissions(permissions);
      setRoles(roles);
      setUserType('customer');

      await Promise.all([
        AsyncStorage.setItem('@LoyaltyApp:token', accessToken),
        AsyncStorage.setItem('@LoyaltyApp:refreshToken', refreshToken),
        AsyncStorage.setItem('@LoyaltyApp:roles', JSON.stringify(roles)),
        AsyncStorage.setItem(
          '@LoyaltyApp:userType',
          responseUserType || 'customer',
        ),
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
      const {
        accessToken,
        refreshToken,
        roles,
        permissions,
        userType: responseUserType,
      } = response.data;

      setPermissions(permissions);
      setRoles(roles);
      setUserType('merchant');

      await Promise.all([
        AsyncStorage.setItem('@LoyaltyApp:token', accessToken),
        AsyncStorage.setItem('@LoyaltyApp:refreshToken', refreshToken),
        AsyncStorage.setItem('@LoyaltyApp:roles', JSON.stringify(roles)),
        AsyncStorage.setItem(
          '@LoyaltyApp:userType',
          responseUserType || 'merchant',
        ),
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
      await handleAuthFailure();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async function updateUser(data: Partial<User>): Promise<void> {
    try {
      const newUser = {
        ...user,
        ...data,
      };
      setUser(newUser as User);
      await AsyncStorage.setItem('@LoyaltyApp:user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async function fetchMe(): Promise<void> {
    const response = await api.get('/user/me');
    setUser(response.data);
    await AsyncStorage.setItem(
      '@LoyaltyApp:user',
      JSON.stringify(response.data),
    );
  }

  async function refreshLoyaltySummary(): Promise<void> {
    try {
      if (userType === 'customer') {
        const response = await api.get('/loyalty-summary/me');
        setLoyaltySummary(response.data);
      }
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
        fetchMe,
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
