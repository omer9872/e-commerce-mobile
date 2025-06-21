'use client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, Image as RNImage, View} from 'react-native';
import {useEffect, useState} from 'react';

import {useTheme} from '../contexts/ThemeContext';
import {API_URL} from '../services/api';

interface IAvatarProps {
  id?: string;
  size: number;
}

const Avatar: React.FC<IAvatarProps> = ({id, size}) => {
  const [token, setToken] = useState<string | null>(null);
  const {colors} = useTheme();

  const styles = getStyles(colors);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('@LoyaltyApp:token');
      setToken(token);
    };
    fetchToken();
  }, []);

  return id && token ? (
    <RNImage
      source={{
        uri: `${API_URL}/image/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }}
      style={[styles.image, {width: size, height: size}]}
    />
  ) : (
    <View style={[styles.image, {width: size, height: size}]}>
      <Icon name="account-circle" size={size} color={colors.primary} />
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    image: {
      borderRadius: '100%',
    },
  });

export default Avatar;
