'use client';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCart} from '../contexts/CartContext';
import Toast from 'react-native-toast-message';

import {Product} from '../types/product';
import Image from '../components/Image';
import {API_URL} from '../services/api';
import {colors} from '../theme/colors';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard = ({product, onPress}: ProductCardProps) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const {addToCart, removeFromCart, items} = useCart();

  // Check if product is already in cart
  useEffect(() => {
    const isInCart = items.some(item => item.product._id === product._id);
    setIsAddedToCart(isInCart);
  }, [items, product._id]);

  const handleAddToCart = (event: any) => {
    event.stopPropagation();
    if (!isAddedToCart) {
      addToCart({
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
    }
  };

  const handleRemoveFromCart = (event: any) => {
    event.stopPropagation();
    removeFromCart(product._id);
    setIsAddedToCart(false);

    // Show toast message
    Toast.show({
      type: 'success',
      text1: 'Removed from Cart',
      text2: `${product.name} has been removed from your cart`,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        id={product.images[0]}
        style={styles.image}
        defaultSource={require('../assets/images/logo.jpg')}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.bottomContainer}>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>
              {product.price} <Text style={styles.pointsLabel}>₺</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isAddedToCart
                ? {backgroundColor: colors.error}
                : {backgroundColor: colors.primary},
            ]}
            onPress={isAddedToCart ? handleRemoveFromCart : handleAddToCart}>
            <Icon
              name={isAddedToCart ? 'cart-remove' : 'cart-plus'}
              size={16}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
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
  pointsContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pointsLabel: {
    fontWeight: 'normal',
  },
  addToCartButton: {
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
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
