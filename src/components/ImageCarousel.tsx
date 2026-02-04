import {
  View,
  StyleSheet,
  useWindowDimensions,
  Image as RNImage,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-reanimated-carousel';
import React, { useEffect, useState } from 'react';

import { useTheme } from '../contexts/ThemeContext';
import { API_URL } from '../services/api';

interface ImageCarouselProps {
  images: string[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 250,
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('@LoyaltyApp:token');
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  if (!images || images.length === 0) {
    return null;
  }

  const styles = getStyles(colors, height);

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={height}
        data={images}
        autoPlay={autoPlay && images.length > 1}
        autoPlayInterval={autoPlayInterval}
        loop={images.length > 1}
        onSnapToItem={index => setActiveIndex(index)}
        renderItem={({ item }) => (
          <RNImage
            source={{
              uri: `${API_URL}/image/${item}`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const getStyles = (colors: any, height: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: height,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary,
    },
    inactiveDot: {
      backgroundColor: colors.white || '#ffffff',
      opacity: 0.6,
    },
  });

export default ImageCarousel;
