'use client';

import {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import {useCart} from '../../contexts/CartContext';
import {useAuth} from '../../contexts/AuthContext';
import {api, API_URL} from '../../services/api';
import type {Product} from 'src/types/product';
import {colors} from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LayoutHeader from '../../components/LayoutHeader';
type ProductDetailScreenRouteProp = RouteProp<
  CustomerHomeStackParamList,
  'ProductDetail'
>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {productId} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const {user, loyaltySummary} = useAuth();
  const {addToCart, removeFromCart, items} = useCart();
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

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

  const handleAddToCart = () => {
    if (!product || isAddedToCart) return;

    addToCart(product);
    setIsAddedToCart(true);

    // Show toast message
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${product.name} has been added to your cart`,
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const handleRemoveFromCart = () => {
    if (!product || !isAddedToCart) return;

    removeFromCart(product._id);
    setIsAddedToCart(false);

    // Show toast message
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${product.name} has been removed from your cart`,
      position: 'bottom',
      visibilityTime: 2000,
    });
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
    <View style={{...styles.container, paddingTop: insets.top}}>
      <View style={styles.subContainer}>
        <LayoutHeader title="Product Details" showBackButton />

        <ScrollView style={styles.scrollView}>
          <Image
            source={{
              uri: `${API_URL}/image/${product.images[0]}`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }}
            style={styles.productImage}
            defaultSource={require('../../assets/images/logo.jpg')}
          />
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
                isAddedToCart
                  ? {backgroundColor: colors.error}
                  : {backgroundColor: colors.primary},
              ]}
              onPress={isAddedToCart ? handleRemoveFromCart : handleAddToCart}>
              <Icon
                name={isAddedToCart ? 'cart-remove' : 'cart-plus'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                {isAddedToCart ? 'Remove from Cart' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>

            {currentBalance < product.points && (
              <Text style={styles.pointsNeeded}>
                You need {product.points - currentBalance} more points to redeem
                this product.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  subContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
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
  productImage: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
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
  addedToCartButton: {
    backgroundColor: '#4CAF50', // Success green color
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailScreen;
