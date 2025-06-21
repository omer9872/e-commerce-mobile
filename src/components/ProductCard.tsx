'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFavorites} from '../contexts/FavoritesContext';
import {useNavigation} from '@react-navigation/native';
import {useCart} from '../contexts/CartContext';
import Toast from 'react-native-toast-message';
import {useEffect, useState} from 'react';

import {useTheme} from '../contexts/ThemeContext';
import {IProduct} from '../types/product';
import Image from '../components/Image';

interface ProductCardProps {
  product: IProduct;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onPress, style}) => {
  const navigation = useNavigation<any>();
  const {
    addToCart,
    removeFromCart,
    items,
    isLoading: isCartLoading,
  } = useCart();
  const {addToFavorites, removeFromFavorites, isInFavorites} = useFavorites();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const {colors} = useTheme();
  // Check if product is already in cart
  useEffect(() => {
    const isInCart = items.some(item => item.product._id === product._id);
    setIsAddedToCart(isInCart);
  }, [items, product._id]);

  const handleToggleFavorites = async () => {
    if (isFavoritesLoading) return;

    try {
      setIsFavoritesLoading(true);
      if (isInFavorites(product._id)) {
        await removeFromFavorites(product._id);
        Toast.show({
          type: 'success',
          text1: 'Removed from Favorites',
          text2: `${product.name} has been removed from your favorites`,
        });
      } else {
        await addToFavorites(product._id);
        Toast.show({
          type: 'success',
          text1: 'Added to Favorites',
          text2: `${product.name} has been added to your favorites`,
        });
      }
    } catch (error) {
      console.error('Error toggling favorites:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update favorites. Please try again.',
      });
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('ProductDetail', {productId: product._id});
    }
  };

  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={isLoading || isCartLoading}>
      <Image
        id={product.images[0]}
        style={styles.image}
        defaultSource={require('../assets/images/logo.jpg')}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorites}
            disabled={isFavoritesLoading}>
            <Icon
              name={isInFavorites(product._id) ? 'heart' : 'heart-outline'}
              size={25}
              color={isInFavorites(product._id) ? colors.error : colors.text}
            />
          </TouchableOpacity>
        </View>
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>
            {product.price} <Text style={styles.amountLabel}>₺</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: 175,
    },
    content: {
      flex: 1,
      padding: 12,
      gap: 6,
      justifyContent: 'space-between',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    bottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    amountContainer: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    amountText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.primary,
    },
    amountLabel: {
      fontWeight: 'normal',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    favoriteButton: {
      padding: 8,
      borderRadius: 8,
    },
    addToCartButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
    },
    addToCartButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

export default ProductCard;
