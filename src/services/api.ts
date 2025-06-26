import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual API URL
export const API_URL = 'http://172.20.10.14:7272';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('@LoyaltyApp:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem(
          '@LoyaltyApp:refreshToken',
        );
        if (!refreshToken) {
          // No refresh token, logout the user
          await AsyncStorage.multiRemove([
            '@LoyaltyApp:token',
            '@LoyaltyApp:refreshToken',
            '@LoyaltyApp:user',
            '@LoyaltyApp:userType',
          ]);

          // Force app to go back to auth screen
          // This would typically be handled by your auth context
          return Promise.reject(error);
        }

        // Call your refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const {token} = response.data;

        // Update the token in storage
        await AsyncStorage.setItem('@LoyaltyApp:token', token);

        // Update the auth header for the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        await AsyncStorage.multiRemove([
          '@LoyaltyApp:token',
          '@LoyaltyApp:refreshToken',
          '@LoyaltyApp:user',
          '@LoyaltyApp:userType',
        ]);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
