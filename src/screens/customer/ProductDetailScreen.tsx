'use client';

import {useEffect, useMemo, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';

import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import {useCart} from '../../contexts/CartContext';
import Image from '../../components/Image';
import {useAuth} from '../../contexts/AuthContext';
import {api, API_URL} from '../../services/api';
import type {Product} from 'src/types/product';
import {colors} from '../../theme/colors';

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
  const {user, loyaltySummary} = useAuth();
  const {addToCart, removeFromCart, items, isLoading: isCartLoading} = useCart();
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const insets = useSafeAreaInsets();

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

  const handleRedeemProduct = async () => {
    if (!product) return;

    try {
      const response = await api.post('/redeem', {productId: product._id});
      if (response.data.success) {
        Alert.alert('Success', 'Product redeemed successfully!');
        // You might want to update the user's points here or navigate back
      } else {
        Alert.alert(
          'Error',
          response.data.message ||
            'Failed to redeem product. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error redeeming product:', error);
      Alert.alert('Error', 'Failed to redeem product. Please try again.');
    }
  };

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
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add item to cart. Please try again.',
        position: 'bottom',
        visibilityTime: 2000,
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
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove item from cart. Please try again.',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderCarouselItem = (item: string) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image id={item} style={styles.productImage} />
      </View>
    );
  };

  const currentBalance = useMemo(
    () => loyaltySummary?.currentBalance || 0,
    [loyaltySummary],
  );

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('@LoyaltyApp:token');
      setToken(token);
    };
    fetchToken();
  }, []);

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
        <Text style={styles.pointsRequired}>{product.price} ₺</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity
          style={[
            styles.redeemButton,
            {opacity: currentBalance >= product.price ? 1 : 0.5},
          ]}
          onPress={handleRedeemProduct}
          disabled={currentBalance < product.price}>
          <Text style={styles.redeemButtonText}>
            {currentBalance >= product.price
              ? 'Redeem Now'
              : 'Not Enough Points'}
          </Text>
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
            <Text style={styles.addToCartButtonText}>
              {isAddedToCart ? 'Remove from Cart' : 'Add to Cart'}
            </Text>
          )}
        </TouchableOpacity>

        {currentBalance < product.points.redeem && (
          <Text style={styles.pointsNeeded}>
            You need {product.points.redeem - currentBalance} more points to
            redeem this product.
          </Text>
        )}
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
  pointsRequired: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  pointsNeeded: {
    marginTop: 10,
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  removeFromCartButton: {
    backgroundColor: colors.error,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailScreen;
