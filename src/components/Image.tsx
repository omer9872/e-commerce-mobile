'use client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Image as RNImage,
  StyleProp,
  ImageStyle,
  ImageURISource,
} from 'react-native';
import {useEffect, useState} from 'react';

import {API_URL} from '../services/api';

interface IImageProps {
  id?: string;
  style?: StyleProp<ImageStyle>;
  defaultSource?: number | ImageURISource | undefined;
}

const Image: React.FC<IImageProps> = ({id, style, defaultSource}) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('@LoyaltyApp:token');
      setToken(token);
    };
    fetchToken();
  }, []);

  return (
    <RNImage
      source={{
        uri: `${API_URL}/image/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }}
      style={[styles.image, style]}
      defaultSource={defaultSource}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});

export default Image;
