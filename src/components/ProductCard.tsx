'use client';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCart} from '../contexts/CartContext';
import Toast from 'react-native-toast-message';

import {Product} from '../types/product';
import Image from '../components/Image';
import {colors} from '../theme/colors';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const ProductCard = ({product, onPress, style}: ProductCardProps) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    addToCart,
    removeFromCart,
    items,
    isLoading: isCartLoading,
  } = useCart();

  // Check if product is already in cart
  useEffect(() => {
    const isInCart = items.some(item => item.product._id === product._id);
    setIsAddedToCart(isInCart);
  }, [items, product._id]);

  const handleAddToCart = async (event: any) => {
    event.stopPropagation();
    if (!isAddedToCart && !isLoading) {
      try {
        setIsLoading(true);
        await addToCart({
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: [product.images[0]],
          points: product.points,
        } as any);
        setIsAddedToCart(true);

        // Show toast message
        Toast.show({
          type: 'success',
          text1: 'Added to Cart',
          text2: `${product.name} has been added to your cart`,
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add item to cart. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveFromCart = async (event: any) => {
    event.stopPropagation();
    if (isAddedToCart && !isLoading) {
      try {
        setIsLoading(true);
        await removeFromCart(product._id);
        setIsAddedToCart(false);

        // Show toast message
        Toast.show({
          type: 'success',
          text1: 'Removed from Cart',
          text2: `${product.name} has been removed from your cart`,
        });
      } catch (error) {
        console.error('Error removing from cart:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to remove item from cart. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={isLoading || isCartLoading}>
      <Image
        id={product.images[0]}
        style={styles.image}
        defaultSource={require('../assets/images/logo.jpg')}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
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
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isAddedToCart
              ? {backgroundColor: colors.error}
              : {backgroundColor: colors.primary},
          ]}
          onPress={isAddedToCart ? handleRemoveFromCart : handleAddToCart}
          disabled={isLoading || isCartLoading}>
          {isLoading || isCartLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.addToCartButtonContent}>
              <Icon
                name={isAddedToCart ? 'cart-remove' : 'cart-plus'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.addToCartText}>
                {isAddedToCart ? 'Remove' : 'Add'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    gap: 10,
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
  addToCartButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ProductCard;
