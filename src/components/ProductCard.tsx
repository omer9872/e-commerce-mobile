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
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';

import { useFavorites } from '@/contexts/FavoritesContext';
import currencyFormatter from '@/utils/currencyFormatter';
import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from '@/contexts/ThemeContext';
import IconButton from '@/components/IconButton';
import { useCart } from '@/contexts/CartContext';
import { IProduct } from '@/types/product';
import Image from '@/components/Image';

interface ProductCardProps {
  product: IProduct;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style }) => {
  const navigation = useNavigation<any>();
  const {
    isLoading: isCartLoading,
  } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const { colors } = useTheme();
  const { t } = useLocale();

  const handleToggleFavorites = async () => {
    if (isFavoritesLoading) return;

    try {
      setIsFavoritesLoading(true);
      if (isInFavorites(product._id)) {
        await removeFromFavorites(product._id);
        Toast.show({
          type: 'success',
          text1: t('components.productCard.removedFromFavorites'),
          text2: t('components.productCard.hasBeenRemovedFromYourFavorites', { productName: product.name }),
        });
      } else {
        await addToFavorites(product._id);
        Toast.show({
          type: 'success',
          text1: t('components.productCard.addedToFavorites'),
          text2: t('components.productCard.hasBeenAddedToYourFavorites', { productName: product.name }),
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.unknownError'),
        text2: t('common.errors.unknownErrorDescription'),
      });
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('ProductDetail', { productId: product._id });
    }
  };

  const styles = getStyles(colors);

  const getFirstVariantPrice = () => {
    const pVariants = product.variants ?? [];
    if (pVariants.length > 1) {
      return pVariants[0].price;
    }
    return 0;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={isCartLoading}>
      <Image
        id={product.images[0]}
        style={styles.image}
        defaultSource={require('../assets/images/logo.jpg')}
      />
      <IconButton
        icon={<Icon name={isInFavorites(product._id) ? 'heart' : 'heart-outline'} size={18} color={colors.text} />}
        onPress={handleToggleFavorites}
        disabled={isFavoritesLoading}
        style={styles.favoriteButton}
        variant='danger'
        size="small"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>
            {currencyFormatter.format(getFirstVariantPrice())}
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
      shadowOffset: { width: 0, height: 2 },
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
      paddingVertical: 4,
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    amountText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.inversePrimary,
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
      position: 'absolute',
      top: 10,
      right: 10,
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
