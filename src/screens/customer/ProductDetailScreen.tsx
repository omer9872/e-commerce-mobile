'use client';

import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import {type RouteProp, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';

import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import {useFavorites} from '../../contexts/FavoritesContext';
import {useCart} from '../../contexts/CartContext';
import type {Product} from 'src/types/product';
import Image from '../../components/Image';
import {colors} from '../../theme/colors';
import {api} from '../../services/api';

type ProductDetailScreenRouteProp = RouteProp<
  CustomerHomeStackParamList,
  'ProductDetail'
>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {productId} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const {
    addToCart,
    removeFromCart,
    items,
    isLoading: isCartLoading,
  } = useCart();
  const width = Dimensions.get('window').width;
  const {addToFavorites, removeFromFavorites, isInFavorites} = useFavorites();
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/product/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert('Error', 'Failed to load product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if product is already in cart
  useEffect(() => {
    if (product) {
      const isInCart = items.some(item => item.product._id === product._id);
      setIsAddedToCart(isInCart);
    }
  }, [items, product]);

  const handleAddToCart = async () => {
    if (!product || isAddedToCart || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product);
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
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!product || !isAddedToCart || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
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
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorites = async () => {
    if (!product) return;

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

  const renderCarouselItem = (item: string) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image id={item} style={styles.productImage} />
      </View>
    );
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {product.images && product.images.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            loop={false}
            width={width}
            height={300}
            autoPlay={false}
            data={product.images}
            scrollAnimationDuration={1000}
            renderItem={({item}) => renderCarouselItem(item)}
            customConfig={() => ({type: 'positive', viewCount: 5})}
          />
        </View>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>{product.price} ₺</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isInFavorites(product._id)
                ? styles.removeFromFavoritesButton
                : null,
            ]}
            onPress={handleToggleFavorites}
            disabled={isFavoritesLoading}>
            {isFavoritesLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.favoriteButtonContent}>
                <Icon
                  name={isInFavorites(product._id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.favoriteButtonText}>
                  {isInFavorites(product._id)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isAddedToCart ? styles.removeFromCartButton : null,
            ]}
            onPress={isAddedToCart ? handleRemoveFromCart : handleAddToCart}
            disabled={isAddingToCart || isCartLoading}>
            {isAddingToCart || isCartLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.addToCartButtonContent}>
                <Icon
                  name={isAddedToCart ? 'cart-remove' : 'cart-plus'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addToCartButtonText}>
                  {isAddedToCart ? 'Remove from Cart' : 'Add to Cart'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  carouselContainer: {
    marginTop: 20,
  },
  carouselItemContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
  },
  contentContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 20,
  },
  favoriteButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  removeFromFavoritesButton: {
    backgroundColor: colors.error,
  },
  favoriteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  removeFromCartButton: {
    backgroundColor: colors.error,
  },
  addToCartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailScreen;
