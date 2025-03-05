'use client';

import {useEffect, useState} from 'react';
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
import {type RouteProp, useRoute} from '@react-navigation/native';
import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import {api, API_URL} from '../../services/api';
import {colors} from '../../theme/colors';
import {useAuth} from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Product} from 'src/types/product';

type ProductDetailScreenRouteProp = RouteProp<
  CustomerHomeStackParamList,
  'ProductDetail'
>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {productId} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuth();

  const [token, setToken] = useState<string | null>(null);

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

  const handleRedeemProduct = async () => {
    if (!product) return;

    try {
      const response = await api.post('/redeem', {productId: product.id});
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
        <Text style={styles.pointsRequired}>
          {product.price} ₺
        </Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity
          style={[
            styles.redeemButton,
            {opacity: user?.points >= product.price ? 1 : 0.5},
          ]}
          onPress={handleRedeemProduct}
          disabled={user?.points < product.price}>
          <Text style={styles.redeemButtonText}>
            {user?.points >= product.price ? 'Redeem Now' : 'Not Enough Points'}
          </Text>
        </TouchableOpacity>

        {user?.points < product.price && (
          <Text style={styles.pointsNeeded}>
            You need {product.price - (user?.points || 0)} more points to redeem
            this product.
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
    height: 300,
    resizeMode: 'cover',
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
    marginTop: 20,
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
});

export default ProductDetailScreen;
